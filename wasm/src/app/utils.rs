pub fn get_1d_index_from_2d_coord(width: u16, x: u16, y: u16) -> u16 {
    (y * width) + x
}

#[cfg(test)]
mod tests {
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
