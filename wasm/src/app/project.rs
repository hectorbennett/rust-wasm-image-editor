use image::{ImageBuffer, RgbaImage};
use serde::{Deserialize, Serialize};

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

    pub fn set_name(&mut self, name: &str) {
        self.name = name.into();
    }

    pub fn resize_canvas(&mut self, width: u32, height: u32) {
        self.width = width;
        self.height = height;
        self.selection = Selection::new(self.width, self.height);
    }

    pub fn new_layer(&mut self) -> &mut Layer {
        let layer: Layer = Layer::new(self.width, self.height);
        let uid: u64 = layer.uid;
        self.layers.push(layer);
        self.set_active_layer(Some(uid));
        self.get_layer(uid)
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
        ImageBuffer::from_fn(self.width as u32, self.height as u32, |x, y| {
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
        let j = serde_json::to_string_pretty(&self).unwrap();
        std::fs::write(path, j)
    }

    pub fn from_json(json: &str) -> Project {
        serde_json::from_str(json).unwrap()
    }
}

#[cfg(test)]
mod tests {
    use std::env;

    use crate::app::App;

    // use super::*;

    #[test]
    fn test_save_and_open_project() {
        let mut test_path = env::temp_dir();
        test_path.push("test_project.json");

        let app = &mut App::new();
        let p = app.new_project();
        p.resize_canvas(10, 10);
        let l1 = p.new_layer();
        l1.set_name("layer 1");
        p.save_project(test_path.to_str().unwrap()).unwrap();

        let p_uid = p.uid.clone();
        app.close_project(&p_uid);

        let p2 = app.open_project(test_path.to_str().unwrap());

        assert_eq!(p_uid, p2.uid);
    }
}
