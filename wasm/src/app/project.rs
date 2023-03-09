use std::{
    collections::hash_map::DefaultHasher,
    hash::{Hash, Hasher},
};

use image::{ImageBuffer, RgbaImage};

use super::{layer::Layer, selection::Selection, utils::generate_uid};

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

    pub fn get_image_hash(&self) -> u64 {
        let mut s = DefaultHasher::new();
        self.get_image().hash(&mut s);
        s.finish()
    }

    // fn render_image(&self) {
    //     let img = self.get_image();
    //     img.save("test.png").unwrap();
    // }

    pub fn get_compiled_pixel(&self, x: u32, y: u32) -> [u8; 4] {
        let mut output: [u8; 4] = [0, 0, 0, 0];
        for layer in self.layers.iter().filter(|l| l.visible) {
            let pixel = layer.get_pixel_from_canvas_coordinates(x, y);
            output = blend_pixels(output, pixel);
        }
        output
    }
}

pub fn blend_pixels(pixel_bg: [u8; 4], pixel_fg: [u8; 4]) -> [u8; 4] {
    let red_bg: f32 = pixel_bg[0] as f32 / 255.0;
    let green_bg: f32 = pixel_bg[1] as f32 / 255.0;
    let blue_bg: f32 = pixel_bg[2] as f32 / 255.0;
    let alpha_bg: f32 = pixel_bg[3] as f32 / 255.0;

    let red_fg: f32 = pixel_fg[0] as f32 / 255.0;
    let green_fg: f32 = pixel_fg[1] as f32 / 255.0;
    let blue_fg: f32 = pixel_fg[2] as f32 / 255.0;
    let alpha_fg: f32 = pixel_fg[3] as f32 / 255.0;

    let alpha_final = alpha_bg + alpha_fg - alpha_bg * alpha_fg;

    let red_bg_a = red_bg * alpha_bg;
    let red_fg_a: f32 = red_fg * alpha_fg;
    let red_final_a = red_fg_a + red_bg_a * (1.0 - alpha_fg);
    let red_final = red_final_a / alpha_final;

    let green_bg_a = green_bg * alpha_bg;
    let green_fg_a: f32 = green_fg * alpha_fg;
    let green_final_a = green_fg_a + green_bg_a * (1.0 - alpha_fg);
    let green_final = green_final_a / alpha_final;

    let blue_bg_a = blue_bg * alpha_bg;
    let blue_fg_a: f32 = blue_fg * alpha_fg;
    let blue_final_a = blue_fg_a + blue_bg_a * (1.0 - alpha_fg);
    let blue_final = blue_final_a / alpha_final;

    [
        (red_final * 255.0) as u8,
        (green_final * 255.0) as u8,
        (blue_final * 255.0) as u8,
        (alpha_final * 255.0) as u8,
    ]
}
