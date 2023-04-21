use super::utils;
use crate::app::layer::Layer;
use serde::{Deserialize, Serialize};

#[derive(Clone, Serialize, Deserialize)]

pub struct Selection {
    width: u32,
    height: u32,
    buffer: Vec<u8>,
}

pub fn f(x0: i32, y0: i32, width: u32, height: u32) -> f64 {
    (x0 as f64 / (width / 2) as f64).powi(2) + (y0 as f64 / (height / 2) as f64).powi(2)
}

pub fn within_ellipse(i: u32, j: u32, x: u32, y: u32, width: u32, height: u32) -> bool {
    let i0: i32 = i as i32 - x as i32 - (width as i32 / 2);
    let j0: i32 = j as i32 - y as i32 - (height as i32 / 2);
    if f(i0, j0, width, height) < 1.0 {
        return true;
    }
    false
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

    pub fn select_inverse(&mut self) {
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

    pub fn add_ellipse(&mut self, x: u32, y: u32, width: u32, height: u32) {
        // add a rectangle to the buffer
        let right = x + width;
        let bottom = y + height;
        (x..right).for_each(|i| {
            (y..bottom).for_each(|j| {
                if within_ellipse(i, j, x, y, width, height) {
                    self.put(i, j, 255);
                }
            });
        });
    }

    pub fn select_rect(&mut self, x: u32, y: u32, width: u32, height: u32) {
        // clear the current selection and select a new rectangle
        self.select_none();
        self.add_rect(x, y, width, height);
    }

    pub fn select_ellipse(&mut self, x: u32, y: u32, width: u32, height: u32) {
        self.select_none();
        self.add_ellipse(x, y, width, height);
    }

    pub fn fuzzy_select(&mut self, layer: &Layer, x: u32, y: u32) {
        // self.select_rect(10, 10, 10, 10);
        self.select_none();
        let colour = layer.get_pixel_from_project_coordinates(x, y);
        (0..self.width).for_each(|i| {
            (0..self.height).for_each(|j| {
                if layer.get_pixel_from_project_coordinates(i, j) == colour {
                    self.put(i, j, 255);
                };
            });
        });
    }

    pub fn pixel_is_on_border(&self, x: u32, y: u32) -> bool {
        if self.from_coords(x, y) != 0 && self.coord_has_empty_neighbour(x, y) {
            return true;
        }
        false
    }

    fn coord_has_empty_neighbour(&self, row: u32, column: u32) -> bool {
        for delta_row in [self.height - 1, 0, 1].iter().cloned() {
            for delta_col in [self.width - 1, 0, 1].iter().cloned() {
                if delta_row == 0 && delta_col == 0 {
                    continue;
                }
                let neighbor_row = (row + delta_row) % self.height;
                let neighbor_col = (column + delta_col) % self.width;

                let idx = utils::get_1d_index_from_2d_coord(self.width, neighbor_row, neighbor_col);

                if self.buffer[idx] == 0 {
                    return true;
                }
            }
        }
        false
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
    fn test_select_inverse() {
        let mut s = Selection::new(4, 2);

        // select a square to the right
        s.select_rect(2, 0, 2, 2);
        s.select_inverse();

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
