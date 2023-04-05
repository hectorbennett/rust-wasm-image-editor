use std::ops::Deref;

use image::{ImageBuffer, RgbaImage};
use serde::{Deserialize, Serialize};

use postcard;

use super::{
    layer::Layer,
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
}

impl Default for Project {
    fn default() -> Self {
        Self::new()
    }
}

impl Project {
    pub fn new() -> Project {
        Project {
            uid: generate_uid(),
            name: "".into(),
            width: 20,
            height: 20,
            layers: vec![],
            active_layer_uid: None,
            selection: Selection::new(20, 20),
        }
    }

    pub fn create_layer(&mut self) -> &mut Layer {
        let mut layer: Layer = Layer::new(self.width, self.height);
        let layer_name = format!("Layer {}", self.layers.len() + 1);
        layer.set_name(&layer_name);
        let uid: u64 = layer.uid;
        self.layers.push(layer);
        self.set_active_layer(Some(uid));
        self.get_layer(uid)
    }

    pub fn delete_layer(&mut self, uid: u64) {
        self.layers.retain(|l| l.uid == uid);
        match self.layers.last() {
            None => self.set_active_layer(None),
            Some(layer) => self.set_active_layer(Some(layer.uid)),
        }
    }

    pub fn get_layer(&mut self, uid: u64) -> &mut Layer {
        return self.layers.iter_mut().find(|l| l.uid == uid).unwrap();
    }

    pub fn set_active_layer(&mut self, uid: Option<u64>) {
        self.active_layer_uid = uid;
    }

    pub fn get_active_layer(&mut self) -> Option<&mut Layer> {
        match self.active_layer_uid {
            None => None,
            Some(layer_uid) => return Some(self.get_layer(layer_uid)),
        }
    }

    pub fn get_image(&self) -> RgbaImage {
        ImageBuffer::from_fn(self.width, self.height, |x, y| {
            image::Rgba(self.get_compiled_pixel(x, y))
        })
    }

    pub fn get_compiled_pixel(&self, x: u32, y: u32) -> [u8; 4] {
        // compile the selection layer and
        if self.selection.pixel_is_on_border(x, y) {
            return [0, 0, 0, 255];
        }

        let mut output: [u8; 4] = [0, 0, 0, 0];
        for layer in self.layers.iter().filter(|l| l.visible) {
            let pixel = layer.get_pixel_from_canvas_coordinates(x, y);
            output = blend_pixels(output, pixel);
        }
        output
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
