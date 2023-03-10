// Takes all the data from the app and compiles it into an image.

use std::{
    collections::hash_map::DefaultHasher,
    hash::{Hash, Hasher},
};

use image::{ImageBuffer, RgbaImage};

use super::{layer::Layer, selection::Selection, utils::generate_uid};

pub struct Canvas {
    pub layers: Vec<&Layer>,
    pub selection: &Selection,
}

impl Default for Canvas {
    fn default() -> Self {
        Self::new()
    }
}

impl Canvas {
    pub fn new(layers: Vec<&Layer>, selection: &Selection) -> Canvas {
        Canvas {
            layers,
            selection
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
