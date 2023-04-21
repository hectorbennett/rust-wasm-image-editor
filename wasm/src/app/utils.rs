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

fn blend_alpha(alpha_fg: f32, alpha_bg: f32) -> f32 {
    alpha_bg + alpha_fg - alpha_bg * alpha_fg
}

fn blend_colour_channel(
    colour_fg: f32,
    colour_bg: f32,
    alpha_fg: f32,
    alpha_bg: f32,
    alpha_final: f32,
) -> f32 {
    (colour_fg * alpha_fg) + (colour_bg * alpha_bg) * (1.0 - alpha_fg) / alpha_final
}

pub fn blend_pixels(pixel_bg: [u8; 4], pixel_fg: [u8; 4]) -> [u8; 4] {
    /* rgba blend 2 pixels */
    if pixel_fg[3] == 255 || pixel_bg[3] == 0 {
        return pixel_fg;
    }
    let alpha_fg: f32 = pixel_fg[3] as f32 / 255.0;

    let red_fg: f32 = pixel_fg[0] as f32 / 255.0;
    let green_fg: f32 = pixel_fg[1] as f32 / 255.0;
    let blue_fg: f32 = pixel_fg[2] as f32 / 255.0;

    let red_bg: f32 = pixel_bg[0] as f32 / 255.0;
    let green_bg: f32 = pixel_bg[1] as f32 / 255.0;
    let blue_bg: f32 = pixel_bg[2] as f32 / 255.0;
    let alpha_bg: f32 = pixel_bg[3] as f32 / 255.0;

    let alpha_final = blend_alpha(alpha_fg, alpha_bg);

    if alpha_final == 0.0 {
        return [0, 0, 0, 0];
    }

    let red_final: f32 = blend_colour_channel(red_fg, red_bg, alpha_fg, alpha_bg, alpha_final);
    let green_final: f32 =
        blend_colour_channel(green_fg, green_bg, alpha_fg, alpha_bg, alpha_final);
    let blue_final: f32 = blend_colour_channel(blue_fg, blue_bg, alpha_fg, alpha_bg, alpha_final);

    [
        (red_final * 255.0) as u8,
        (green_final * 255.0) as u8,
        (blue_final * 255.0) as u8,
        (alpha_final * 255.0) as u8,
    ]
}

/* TODO: Alpha Blending with No Division Operations Jerry R. Van Aken */
