use image::{imageops, ImageBuffer, Pixel, RgbaImage};
use rand::Rng;

use super::colour::Colour;

pub fn generate_uid() -> u64 {
    let mut rng = rand::thread_rng();
    return rng.gen();
}

pub struct Layer {
    pub uid: u64,
    pub name: String,
    pub width: u16,
    pub height: u16,
    pub visible: bool,
    img: RgbaImage,
}

impl Layer {
    pub fn new() -> Layer {
        return Layer {
            uid: generate_uid(),
            name: "".into(),
            width: 500,
            height: 500,
            visible: true,
            img: ImageBuffer::from_fn(500, 500, |_x, _y| image::Rgba([0, 0, 0, 0])),
        };
    }

    pub fn set_name(&mut self, name: &str) -> () {
        self.name = name.into();
    }

    pub fn resize(&mut self, width: u16, height: u16) -> () {
        self.width = width;
        self.height = height;
        let sub_img = imageops::crop(&mut self.img, 0, 0, width as u32, height as u32);
        self.img = sub_img.to_image();
    }

    pub fn set_visible(&mut self, visible: bool) -> () {
        self.visible = visible;
    }

    pub fn fill_rect(
        &mut self,
        colour: Colour,
        left: u16,
        top: u16,
        width: u16,
        height: u16,
    ) -> () {
        let right = left + width;
        let bottom = top + height;
        (left..=right).for_each(|i: u16| {
            (top..=bottom).for_each(|j: u16| {
                let pixel = image::Rgba(colour.as_rgba());
                self.img.put_pixel(i as u32, j as u32, pixel);
            });
        });
    }

    pub fn get_pixel_from_canvas_coordinates(&self, x: u16, y: u16) -> [u8; 4] {
        let pixel = *self.img.get_pixel(x as u32, y as u32);
        let rgba = pixel.to_rgba();
        return rgba.0;
    }
}
