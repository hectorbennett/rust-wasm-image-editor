use crate::app::Colour;
use image::{ImageBuffer, RgbaImage};
use postcard;
use serde::{Deserialize, Serialize};
use std::io::Cursor;
use std::ops::Deref;

#[cfg(feature = "parallel")]
use rayon::prelude::*;

use super::{
    layer::Layer,
    pixel_buffer::{Pixel, PixelBuffer},
    selection::Selection,
    utils::{blend_pixels, generate_uid},
};

#[derive(Serialize, Deserialize)]
pub struct Project {
    pub uid: u64,
    pub name: String,
    pub width: u32,
    pub height: u32,
    pub layers: Vec<Layer>,
    pub active_layer_uid: Option<u64>,
    pub selection: Selection,
    #[serde(skip)]
    buffer: PixelBuffer,
}

impl Default for Project {
    fn default() -> Self {
        Self::new("Untitled", 512, 512)
    }
}

impl Project {
    pub fn new(name: &str, width: u32, height: u32) -> Project {
        let mut project = Project {
            uid: generate_uid(),
            name: name.into(),
            width,
            height,
            layers: vec![],
            active_layer_uid: None,
            selection: Selection::new(width, height),
            buffer: PixelBuffer::new(width, height),
        };
        project.create_layer();
        project.recalculate_buffer();
        project
    }

    pub fn create_layer(&mut self) -> &mut Layer {
        let mut layer: Layer = Layer::new(self.width, self.height);
        let layer_name = format!("Layer {}", self.layers.len() + 1);
        layer.set_name(&layer_name);
        let uid: u64 = layer.uid;
        self.layers.push(layer);
        self.set_active_layer(Some(uid));
        self.get_layer_mut(uid)
    }

    pub fn get_layer_mut(&mut self, uid: u64) -> &mut Layer {
        return self.layers.iter_mut().find(|l| l.uid == uid).unwrap();
    }

    pub fn get_layer(&self, uid: u64) -> &Layer {
        return self.layers.iter().find(|l| l.uid == uid).unwrap();
    }

    pub fn set_active_layer(&mut self, uid: Option<u64>) {
        self.active_layer_uid = uid;
    }

    pub fn get_active_layer_mut(&mut self) -> Option<&mut Layer> {
        match self.active_layer_uid {
            None => None,
            Some(layer_uid) => return Some(self.get_layer_mut(layer_uid)),
        }
    }

    pub fn get_active_layer(&self) -> Option<&Layer> {
        match self.active_layer_uid {
            None => None,
            Some(layer_uid) => return Some(self.get_layer(layer_uid)),
        }
    }

    pub fn reeorder_layers(&mut self, uids_in_order: &[u64]) {
        let mut layers = vec![];
        // assert_eq!(uids_in_order.len(), layers.len());
        uids_in_order.iter().for_each(|uid| {
            let l = self.layers.remove(
                self.layers
                    .iter()
                    .position(|l| l.uid == *uid)
                    .expect("layer not found"),
            );
            layers.push(l);
        });
        self.layers = layers;
    }

    fn get_image(&self) -> RgbaImage {
        ImageBuffer::from_fn(self.width, self.height, |x, y| {
            image::Rgba(self.get_pixel(x, y).unwrap())
        })
    }

    pub fn to_png(&self) -> Vec<u8> {
        let img = self.get_image();
        let mut bytes: Vec<u8> = Vec::new();
        if let Err(e) = img.write_to(&mut Cursor::new(&mut bytes), image::ImageOutputFormat::Png) {
            println!("{e:?}")
        }
        bytes
    }

    pub fn recalculate_buffer(&mut self) {
        self.buffer = PixelBuffer {
            width: self.width,
            height: self.height,
            buffer: self.get_bytes(),
        };
    }

    pub fn get_row_bytes(&self, y: u32) -> Vec<u8> {
        (0..self.width)
            .flat_map(|x| {
                self.calculate_pixel_with_checkerboard_background(x, y)
                    .unwrap()
            })
            .collect()
    }

    // Single-threaded implementation.
    #[cfg(not(feature = "rayon"))]
    pub fn get_bytes(&self) -> Vec<u8> {
        (0..self.height)
            .flat_map(|y| self.get_row_bytes(y))
            .collect()
    }

    // Multi-threaded implementation.
    #[cfg(feature = "rayon")]
    pub fn get_bytes(&self) -> Vec<u8> {
        (0..self.height)
            .into_par_iter()
            .flat_map(|y| self.get_row_bytes(y))
            .collect()
    }

    pub fn get_pixel(&self, x: u32, y: u32) -> Option<Pixel> {
        self.buffer.get(x, y)
    }

    pub fn buffer(&self) -> &PixelBuffer {
        &self.buffer
    }

    fn calculate_pixel(&self, x: u32, y: u32) -> Option<Pixel> {
        if x > self.width || y > self.height {
            return None;
        }
        let mut output: [u8; 4] = [0, 0, 0, 0];
        for layer in self.layers.iter().filter(|l| l.visible) {
            let pixel = layer.get_pixel_from_project_coordinates(x, y);
            output = blend_pixels(output, pixel);
        }
        Some(output)
    }

    fn calculate_pixel_with_checkerboard_background(&self, x: u32, y: u32) -> Option<Pixel> {
        if let Some(pixel) = self.calculate_pixel(x, y) {
            if pixel[3] == 255 {
                return Some(pixel);
            } else {
                let c = get_checkerboard_pixel(x, y);
                return Some(blend_pixels(c, pixel));
            }
        }
        None
    }

    pub fn save_project(&self, path: &str) -> std::io::Result<()> {
        let j = self.to_postcard();
        std::fs::write(path, j)
    }

    pub fn to_json(&self) -> String {
        serde_json::to_string(&self).unwrap()
    }

    pub fn to_postcard(&self) -> Vec<u8> {
        postcard::to_allocvec(&self).unwrap()
    }

    pub fn from_json(json: &str) -> Project {
        serde_json::from_str(json).unwrap()
    }

    pub fn from_postcard(p: Vec<u8>) -> Project {
        postcard::from_bytes(p.deref()).unwrap()
    }
}

fn get_checkerboard_pixel(x: u32, y: u32) -> Pixel {
    const GREY_1: Pixel = [135, 135, 135, 255];
    const GREY_2: Pixel = [90, 90, 90, 255];
    const SQUARE_SIZE: u32 = 10;
    if ((x / SQUARE_SIZE) + (y / SQUARE_SIZE)).rem_euclid(2) == 0 {
        GREY_1
    } else {
        GREY_2
    }
}

// demo project
impl Project {
    pub fn demo() -> Project {
        // red square
        let mut layer1 = Layer::new(1000, 1000);
        let mut selection1 = Selection::new(1000, 1000);
        let colour1 = Colour::from_rgba(255, 0, 0, 150);
        selection1.select_rect(100, 150, 150, 150);
        layer1.fill_selection(&selection1, &colour1);

        // green square
        let mut layer2 = Layer::new(1000, 1000);
        let mut selection2 = Selection::new(1000, 1000);
        let colour2 = Colour::from_rgba(0, 255, 0, 150);
        selection2.select_rect(220, 100, 180, 150);
        layer2.fill_selection(&selection2, &colour2);

        // blue circle
        let mut layer3 = Layer::new(1000, 1000);
        let mut selection3 = Selection::new(1000, 1000);
        let colour3 = Colour::from_rgba(0, 0, 255, 150);
        selection3.select_ellipse(180, 200, 200, 200);
        layer3.fill_selection(&selection3, &colour3);

        let mut project = Project::new("Demo", 1000, 1000);
        project.layers.push(layer1);
        project.layers.push(layer2);
        project.layers.push(layer3);
        project
    }
}
