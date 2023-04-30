use image::DynamicImage;

use super::buffer::Buffer;

pub type RgbaBuffer = Buffer<4>;

impl RgbaBuffer {
    pub fn from_image(img: DynamicImage) -> RgbaBuffer {
        RgbaBuffer::new_with_data(img.width(), img.height(), img.to_rgba8().into_raw())
    }
}
