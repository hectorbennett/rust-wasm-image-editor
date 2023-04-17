use std::{
    cmp,
    collections::hash_map::DefaultHasher,
    hash::{Hash, Hasher},
};

// use image::{
//     imageops::{self, FilterType::Nearest},
//     ImageBuffer, Pixel, RgbaImage,
// };
use serde::{Deserialize, Serialize};

use super::{
    colour::Colour,
    selection::Selection,
    utils::{generate_uid, get_1d_index_from_2d_coord},
};

pub type LayerBuffer = Vec<u8>;

#[derive(Serialize, Deserialize, Clone)]
pub struct Layer {
    pub uid: u64,
    pub name: String,
    pub width: u32,
    pub height: u32,
    pub left: i32,
    pub top: i32,
    pub visible: bool,
    pub locked: bool,
    // img: RgbaImage,
    buffer: LayerBuffer,
}

impl Default for Layer {
    fn default() -> Self {
        Self::new(500, 500)
    }
}

impl Layer {
    pub fn new(width: u32, height: u32) -> Layer {
        Layer {
            uid: generate_uid(),
            name: "".into(),
            width,
            height,
            left: 0,
            top: 0,
            visible: true,
            locked: false,
            buffer: vec![0; (width * height * 4) as usize],
        }
    }

    pub fn get_buffer(&self) -> &LayerBuffer {
        &self.buffer
    }

    pub fn set_buffer(&mut self, buffer: LayerBuffer) {
        self.buffer = buffer
    }

    pub fn set_name(&mut self, name: &str) {
        self.name = name.into();
    }

    pub fn get_thumbnail(&self) -> Vec<u8> {
        // imageops::resize(&self.img, 20, 20, Nearest)
        vec![]
    }

    pub fn get_thumbnail_hash(&self) -> u64 {
        let mut s = DefaultHasher::new();
        self.get_thumbnail().hash(&mut s);
        s.finish()
    }

    pub fn resize(&mut self, width: u32, height: u32) {
        self.width = width;
        self.height = height;
        // let sub_img = imageops::crop(&mut self.img, 0, 0, width as u32, height as u32);
        // self.img = sub_img.to_image();
    }

    pub fn set_position(&mut self, left: i32, top: i32) {
        self.left = left;
        self.top = top;
    }

    pub fn set_visible(&mut self, visible: bool) {
        self.visible = visible;
    }

    pub fn set_locked(&mut self, locked: bool) {
        self.locked = locked;
    }

    pub fn fill_selection(&mut self, selection: &Selection, colour: &Colour) {
        (0..self.width).for_each(|i| {
            (0..=self.height).for_each(|j| {
                let coords = self.layer_to_canvas_coords(i, j);
                if coords[0] >= 0 && coords[1] >= 0 {
                    let value = selection.from_coords(coords[0] as u32, coords[1] as u32);
                    if value != 0 {
                        let alpha = ((colour.alpha as u16 * value as u16) / 255) as u8;
                        let i: usize = get_1d_index_from_2d_coord(self.width, i, j) * 4;
                        self.buffer[i] = colour.red;
                        self.buffer[i + 1] = colour.green;
                        self.buffer[i + 2] = colour.blue;
                        self.buffer[i + 3] = alpha;
                    }
                }
            });
        });
    }

    pub fn pixel_is_on_border(&self, x: u32, y: u32) -> bool {
        let is_on_x: bool =
            x as i32 == self.left || x as i32 == self.left + (self.width as i32) - 1;
        let is_on_y: bool = y as i32 == self.top || y as i32 == self.top + (self.height as i32) - 1;

        let is_in_x: bool = x as i32 > self.left && (x as i32) < self.left + (self.width as i32);
        let is_in_y: bool = y as i32 > self.top && (y as i32) < self.top + (self.height as i32);

        is_on_x && is_in_y || is_on_y && is_in_x
    }

    pub fn get_pixel_from_canvas_coordinates(&self, x: u32, y: u32) -> [u8; 4] {
        if x < cmp::max(self.left, 0).try_into().unwrap()
            || y < cmp::max(self.top, 0).try_into().unwrap()
            || x >= (self.left + self.width as i32).try_into().unwrap()
            || y >= (self.top + self.height as i32).try_into().unwrap()
        {
            // out of bounds
            return [0, 0, 0, 0];
        }

        let translated_x: u32 = (x as i32 - self.left).try_into().unwrap();
        let translated_y: u32 = (y as i32 - self.top).try_into().unwrap();

        let i: usize = get_1d_index_from_2d_coord(self.width, translated_x, translated_y) * 4;
        [
            self.buffer[i],
            self.buffer[i + 1],
            self.buffer[i + 2],
            self.buffer[i + 3],
        ]
    }

    pub fn layer_to_canvas_coords(&self, i: u32, j: u32) -> [i32; 2] {
        [i as i32 + self.left, j as i32 + self.top]
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_fill_selection() {
        let mut layer = Layer::new(2, 2);
        let mut selection = Selection::new(2, 2);

        selection.select_rect(0, 0, 2, 1);

        let colour = Colour::from_rgba(1, 2, 3, 4);

        layer.fill_selection(&selection, &colour);

        // assert_eq!(
        //     layer.img.into_raw(),
        //     vec![1, 2, 3, 4, 1, 2, 3, 4, 255, 255, 255, 0, 255, 255, 255, 0]
        // );
    }
}
