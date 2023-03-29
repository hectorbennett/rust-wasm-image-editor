use std::{
    collections::hash_map::DefaultHasher,
    hash::{Hash, Hasher},
};

// use image::{
//     imageops::{self, FilterType::Nearest},
//     ImageBuffer, Pixel, RgbaImage,
// };
use serde::{Deserialize, Serialize};

use super::{colour::Colour, selection::Selection, utils::generate_uid};

#[derive(Serialize, Deserialize)]
pub struct Layer {
    pub uid: u64,
    pub name: String,
    pub width: u32,
    pub height: u32,
    pub visible: bool,
    pub locked: bool,
    // img: RgbaImage,
    buffer: Vec<u8>,
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
            visible: true,
            locked: false,
            buffer: vec![0; (width * height * 4) as usize],
        }
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

    pub fn set_visible(&mut self, visible: bool) {
        self.visible = visible;
    }

    pub fn set_locked(&mut self, locked: bool) {
        self.locked = locked;
    }

    pub fn fill_selection(&mut self, selection: &Selection, colour: &Colour) {
        (0..self.width).for_each(|i| {
            (0..=self.height).for_each(|j| {
                let value = selection.from_coords(i, j);
                if value != 0 {
                    let _alpha = ((colour.alpha as u16 * value as u16) / 255) as u8;
                    // let pixel = image::Rgba([colour.red, colour.green, colour.blue, alpha]);
                    // self.img.put_pixel(i, j, pixel);
                }
            });
        });
    }

    pub fn get_pixel_from_canvas_coordinates(&self, _x: u32, _y: u32) -> [u8; 4] {
        // let pixel = *self.img.get_pixel(x, y);
        // let rgba = pixel.to_rgba();
        // rgba.0
        [0, 0, 0, 0]
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
