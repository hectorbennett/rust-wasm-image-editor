use std::{
    collections::hash_map::DefaultHasher,
    hash::{Hash, Hasher},
};

use image::{ImageBuffer, RgbaImage};
use indexmap::IndexMap;
use rand::Rng;

use super::layer::Layer;

pub fn generate_uid() -> u64 {
    let mut rng = rand::thread_rng();
    return rng.gen();
}

pub struct Project {
    pub uid: u64,
    pub name: String,
    pub width: u16,
    pub height: u16,
    pub layers: Vec<Layer>,
}

impl Project {
    pub fn new() -> Project {
        return Project {
            uid: generate_uid(),
            name: "".into(),
            width: 20,
            height: 20,
            layers: vec![],
        };
    }

    pub fn set_name(&mut self, name: &str) -> () {
        self.name = name.into();
    }

    pub fn resize_canvas(&mut self, width: u16, height: u16) -> () {
        self.width = width;
        self.height = height;
    }

    pub fn new_layer(&mut self) -> &mut Layer {
        let layer: Layer = Layer::new();
        let uid: u64 = layer.uid.clone();
        self.layers.push(layer);
        return self.get_layer(uid);
    }

    pub fn get_layer(&mut self, uid: u64) -> &mut Layer {
        return self.layers.iter_mut().find(|l| l.uid == uid).unwrap();
        // return self.layers.get_mut(&uid).unwrap();
    }

    pub fn get_image(&self) -> RgbaImage {
        return ImageBuffer::from_fn(self.width as u32, self.height as u32, |x, y| {
            return image::Rgba(self.get_compiled_pixel(x as u16, y as u16));
        });
    }

    pub fn get_image_hash(&self) -> u64 {
        let mut s = DefaultHasher::new();
        self.get_image().hash(&mut s);
        return s.finish();
    }

    fn render_image(&self) -> () {
        let img = self.get_image();
        img.save("test.png").unwrap();
    }

    fn get_compiled_pixel(&self, x: u16, y: u16) -> [u8; 4] {
        let mut output: [u8; 4] = [0, 0, 0, 0];
        for layer in self.layers.iter().filter(|l| l.visible) {
            let pixel = layer.get_pixel_from_canvas_coordinates(x, y);
            output = blend_pixels(output, pixel);
        }
        return output;
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

    return [
        (red_final * 255.0) as u8,
        (green_final * 255.0) as u8,
        (blue_final * 255.0) as u8,
        (alpha_final * 255.0) as u8,
    ];
}
