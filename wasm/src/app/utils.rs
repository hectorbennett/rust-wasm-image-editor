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
    // todo: shall we rename this function?
    ((y * width) + x) as usize
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

fn blend_colour_channel(colour_fg: f32, colour_bg: f32, alpha_fg: f32, alpha_bg: f32) -> f32 {
    (colour_fg * alpha_fg)
        + (colour_bg * alpha_bg) * (1.0 - alpha_fg) / blend_alpha(alpha_fg, alpha_bg)
}

pub fn blend_pixels(pixel_bg: [u8; 4], pixel_fg: [u8; 4]) -> [u8; 4] {
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
    let red_final: f32 = blend_colour_channel(red_fg, red_bg, alpha_fg, alpha_bg);
    let green_final: f32 = blend_colour_channel(green_fg, green_bg, alpha_fg, alpha_bg);
    let blue_final: f32 = blend_colour_channel(blue_fg, blue_bg, alpha_fg, alpha_bg);

    [
        (red_final * 255.0) as u8,
        (green_final * 255.0) as u8,
        (blue_final * 255.0) as u8,
        (alpha_final * 255.0) as u8,
    ]
}
