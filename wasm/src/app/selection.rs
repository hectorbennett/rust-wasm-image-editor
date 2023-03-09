use super::utils;

#[derive(Clone)]
pub struct Selection {
    width: u32,
    height: u32,
    buffer: Vec<u8>,
}

impl Selection {
    pub fn new(width: u32, height: u32) -> Selection {
        Selection {
            width,
            height,
            buffer: vec![0; (width * height) as usize],
        }
    }

    pub fn put(&mut self, x: u32, y: u32, alpha: u8) {
        if x >= self.width || y >= self.height {
            return;
        }
        // put an alpha value into the buffer at pixel coordinate x, y
        let i = utils::get_1d_index_from_2d_coord(self.width, x, y);
        self.buffer[i] = alpha;
    }

    pub fn from_coords(&self, x: u32, y: u32) -> u8 {
        if x >= self.width || y >= self.height {
            return 0;
        }
        let i = utils::get_1d_index_from_2d_coord(self.width, x, y);
        self.buffer[i]
    }

    pub fn select_none(&mut self) {
        // reset the buffer
        self.buffer = vec![0; (self.width * self.height) as usize]
    }

    pub fn select_all(&mut self) {
        self.buffer = vec![255; (self.width * self.height) as usize]
    }

    pub fn invert_selection(&mut self) {
        for i in 0..self.buffer.len() {
            self.buffer[i] = 255 - self.buffer[i]
        }
    }

    pub fn add_rect(&mut self, x: u32, y: u32, width: u32, height: u32) {
        // add a rectangle to the buffer
        let right = x + width;
        let bottom = y + height;
        (x..right).for_each(|i| {
            (y..bottom).for_each(|j| {
                self.put(i, j, 255);
            });
        });
    }

    pub fn select_rect(&mut self, x: u32, y: u32, width: u32, height: u32) {
        // clear the current selection and select a new rectangle
        self.select_none();
        self.add_rect(x, y, width, height);
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_empty_buffer() {
        // check that creating a new 3x3 selection inits a vector of 9 zeroes
        let s = Selection::new(3, 3);
        assert_eq!(s.buffer, vec![0; 9]);
    }

    #[test]
    fn test_add_rect() {
        let mut s = Selection::new(3, 3);

        // select a 2x2 square to the selection positioned at the origin.
        s.select_rect(0, 0, 2, 2);
        assert_eq!(s.buffer, vec![255, 255, 0, 255, 255, 0, 0, 0, 0]);

        // add 2 pixels in the bottom right corner
        s.add_rect(1, 2, 2, 1);
        assert_eq!(s.buffer, vec![255, 255, 0, 255, 255, 0, 0, 255, 255]);
    }

    #[test]
    fn test_select_all() {
        let mut s = Selection::new(3, 3);
        s.select_all();
        assert_eq!(s.buffer, vec![255; 9]);
    }

    #[test]
    fn test_invert_selection() {
        let mut s = Selection::new(4, 2);

        // select a square to the right
        s.select_rect(2, 0, 2, 2);
        s.invert_selection();

        assert_eq!(s.buffer, [255, 255, 0, 0, 255, 255, 0, 0])
    }

    #[test]
    fn test_select_rect_out_of_bounds() {
        // what happens if we select too wide
        let mut s = Selection::new(2, 2);
        s.select_rect(1, 0, 10, 5);

        assert_eq!(s.buffer, [0, 255, 0, 255]);
    }

    #[test]
    fn test_from_coords() {
        let mut s = Selection::new(3, 3);
        s.select_rect(1, 1, 1, 1);

        assert_eq!(s.from_coords(0, 0), 0);
        assert_eq!(s.from_coords(1, 1), 255);
    }
}
