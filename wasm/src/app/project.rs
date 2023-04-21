use image::{ImageBuffer, RgbaImage};
use serde::{Deserialize, Serialize};
use std::io::Cursor;
use std::ops::Deref;

use postcard;

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

    pub fn get_image(&self) -> RgbaImage {
        ImageBuffer::from_fn(self.width, self.height, |x, y| {
            image::Rgba(self.get_pixel(x, y).unwrap())
        })
    }

    pub fn to_png(&self) -> Vec<u8> {
        let img = self.get_image();
        let mut bytes: Vec<u8> = Vec::new();
        if let Err(e) = img.write_to(&mut Cursor::new(&mut bytes), image::ImageOutputFormat::Png) {
            println!("{:?}", e)
        }
        bytes
    }

    pub fn recalculate_buffer(&mut self) {
        let mut buffer = PixelBuffer::new(self.width, self.height);

        (0..self.width).for_each(|i| {
            (0..self.height).for_each(|j| {
                let pixel = self.calculate_pixel(i, j).unwrap();
                buffer.set(i, j, pixel);
            })
        });
        self.buffer = buffer;
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
