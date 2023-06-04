use std::simd::u32x2;
use uuid::Uuid;

pub fn generate_uid() -> u64 {
    let id = Uuid::new_v4();
    id.to_u128_le() as u64
}

#[cfg(test)]
mod generate_uid_tests {
    use super::*;

    #[test]
    fn test_generate_uid() {
        let uid = generate_uid();
        assert!(uid > 0);
    }
}

pub fn get_1d_index_from_2d_coord(width: u32, x: u32, y: u32) -> usize {
    // todo: shall we rename this function? Shall we allow negative coords
    ((y * width) + x) as usize
}

pub fn coord_is_on_border_of_rect(rect: [i32; 4], coord: [i32; 2]) -> bool {
    // check if the coord lies on the edge of the rect.
    let left = rect[0];
    let top = rect[1];
    let width = rect[2];
    let height = rect[3];
    let right = left + width;
    let bottom = top + height;
    let x = coord[0];
    let y = coord[1];

    let is_on_x: bool = x == left || x == right;
    let is_on_y: bool = y == top || y == bottom;

    let is_in_x: bool = x >= left && x <= right;
    let is_in_y: bool = y >= top && y <= bottom;

    is_on_x && is_in_y || is_on_y && is_in_x
}

pub fn coord_is_on_outline_of_rect(rect: [i32; 4], coord: [i32; 2]) -> bool {
    // check if the coord lies one pixel outside of the rect
    let expanded_rect = [rect[0] - 1, rect[1] - 1, rect[2] + 1, rect[3] + 1];
    coord_is_on_border_of_rect(expanded_rect, coord)
}

#[cfg(test)]
mod get_1d_index_from_2d_coord_tests {
    use super::*;

    #[test]
    fn test_one() {
        /* e.g. the image

            [a, b, c],
            [d, e, f],
            [g, h, i]

        has a 1d buffer of

            [a, b, c, d, e, f, g, h, i]

        and so
         - the coord for 'a' is (0, 0) -> 0
         - the coord for 'd' is (0, 1) -> 3
         - the coord for 'f' is (2, 1) -> 5
        */
        assert_eq!(get_1d_index_from_2d_coord(3, 0, 0), 0);
        assert_eq!(get_1d_index_from_2d_coord(3, 2, 1), 5);
    }

    #[test]
    fn test_two() {
        /* e.g. the image

            [a, b],
            [c, d],
            [e, f]

        has a 1d buffer of

            [a, b, c, d, e, f]

        and so
         - the coord for 'b' is (0, 1) -> 1
         - the coord for 'f' is (1, 2) -> 5
        */

        assert_eq!(get_1d_index_from_2d_coord(2, 1, 0), 1);
        assert_eq!(get_1d_index_from_2d_coord(2, 1, 2), 5);
    }
}

#[inline]
pub fn fast_divide_by_255(i: u32) -> u32 {
    (i + 1 + (i >> 8)) >> 8
}

pub fn blend_pixels(bg: [u8; 4], fg: [u8; 4]) -> [u8; 4] {
    let r_fg = fg[0] as u32;
    let g_fg = fg[1] as u32;
    let b_fg = fg[2] as u32;
    let a_fg = fg[3] as u32;
    let r_bg = bg[0] as u32;
    let g_bg = bg[1] as u32;
    let b_bg = bg[2] as u32;
    let a_bg = bg[3] as u32;

    if a_fg == 255 || a_bg == 0 {
        return fg;
    }

    let thing_1 = 255 * a_fg;
    let thing_2 = 255 * a_bg - a_fg * a_bg;

    // calculate final alpha * 255
    let a_0 = thing_1 + thing_2;

    if a_0 == 0 {
        return [0, 0, 0, 0];
    }

    // calculate red and green together with simd
    let rg = (u32x2::splat(thing_1) * u32x2::from([r_fg, g_fg])
        + u32x2::splat(thing_2) * u32x2::from([r_bg, g_bg]))
        / u32x2::splat(a_0);

    // calculate blue on its own
    let b = (thing_1 * b_fg + thing_2 * b_bg) / a_0;

    [
        rg[0] as u8,
        rg[1] as u8,
        b as u8,
        fast_divide_by_255(a_0) as u8,
    ]
}
