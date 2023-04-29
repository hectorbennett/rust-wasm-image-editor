use image::DynamicImage;

use super::buffer::Buffer;

pub type RgbaBuffer = Buffer<4>;

impl RgbaBuffer {
    pub fn from_image(img: DynamicImage) -> RgbaBuffer {
        RgbaBuffer::new_with_data(
            img.width().try_into().unwrap(),
            img.height().try_into().unwrap(),
            img.to_rgba8().into_raw(),
        )
    }
}
