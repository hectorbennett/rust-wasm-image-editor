use super::utils;

pub struct Selection {
    width: u16,
    height: u16,
    buffer: Vec<u8>,
}

impl Selection {
    pub fn new(width: u16, height: u16) -> Selection {
        Selection {
            width,
            height,
            buffer: vec![0; (width * height).into()],
        }
    }

    pub fn put(&mut self, x: u16, y: u16, alpha: u8) {
        // put an alpha value into the buffer at pixel coordinate x, y
        let x = utils::get_1d_index_from_2d_coord(self.width, x, y);
        self.buffer[x as usize] = alpha;
    }

    pub fn clear(&mut self) {
        // reset the buffer
        self.buffer = vec![0; (self.width * self.height).into()]
    }

    pub fn add_rect(&mut self, x: u16, y: u16, width: u16, height: u16) {
        // add a rectangle to the buffer
        let right = x + width;
        let bottom = y + height;
        (x..=right).for_each(|i: u16| {
            (y..=bottom).for_each(|j: u16| {
                self.put(i, j, 255);
            });
        });
    }

    pub fn select_rect(&mut self, x: u16, y: u16, width: u16, height: u16) {
        // clear the current selection and select a new rectangle
        self.clear();
        self.add_rect(x, y, width, height);
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_init_buffer() {
        // check that creating a new 3x3 selection inits a vector of 9 zeroes
        let mut s = Selection::new(3, 3);
        assert_eq!(s.buffer, vec![0, 0, 0, 0, 0, 0, 0, 0, 0]);

        // add a 2x2 square to the selection positioned at the origin.
        s.add_rect(0, 0, 2, 2);
        // assert_eq!(s.buffer, vec![255, 255, 0, 255, 255, 0, 0, 0, 0]);
    }
}
