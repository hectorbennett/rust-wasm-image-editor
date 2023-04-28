pub type Pixel = [u8; 4];

use super::utils::get_1d_index_from_2d_coord;
use image::DynamicImage;

#[derive(Clone, Debug)]
pub struct PixelBuffer {
    pub buffer: Vec<u8>,
    pub width: u32,
    pub height: u32,
}

impl Default for PixelBuffer {
    fn default() -> Self {
        Self::new(500, 500)
    }
}

impl PixelBuffer {
    pub fn new(width: u32, height: u32) -> PixelBuffer {
        PixelBuffer {
            width,
            height,
            buffer: vec![0; (width * height * 4) as usize],
        }
    }

    pub fn from_image(img: DynamicImage) -> PixelBuffer {
        let (width, height) = (img.width(), img.height());
        let mut buffer = vec![];
        for pixel in img.to_rgba8().pixels() {
            buffer.extend_from_slice(&pixel.0);
        }
        PixelBuffer {
            width,
            height,
            buffer,
        }
    }

    pub fn get(&self, x: u32, y: u32) -> Option<Pixel> {
        if x >= self.width || y >= self.height {
            return None;
        }
        let i: usize = get_1d_index_from_2d_coord(self.width, x, y) * 4;
        Some(self.buffer[i..=i + 3].try_into().unwrap())
    }

    pub fn set(&mut self, x: u32, y: u32, pixel: Pixel) {
        let i: usize = get_1d_index_from_2d_coord(self.width, x, y) * 4;
        if x >= self.width || y >= self.height {
            return;
        }
        self.buffer[i] = pixel[0];
        self.buffer[i + 1] = pixel[1];
        self.buffer[i + 2] = pixel[2];
        self.buffer[i + 3] = pixel[3];
    }

    pub fn as_vec(&self) -> Vec<u8> {
        self.buffer.clone()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn get_pixel() {
        let pixel_buffer = PixelBuffer::new(10, 10);
        assert_eq!(pixel_buffer.get(1, 1).unwrap(), [0, 0, 0, 0]);
    }

    #[test]
    fn get_pixel_out_of_bounds() {
        let pixel_buffer = PixelBuffer::new(10, 10);
        assert_eq!(pixel_buffer.get(11, 11), None);
    }

    #[test]
    fn write_pixel() {
        let mut pixel_buffer = PixelBuffer::new(10, 10);
        pixel_buffer.set(1, 1, [255, 255, 255, 255]);
        assert_eq!(pixel_buffer.get(1, 1).unwrap(), [255, 255, 255, 255]);
    }

    #[test]
    fn as_vec() {
        let pixel_buffer = PixelBuffer::new(2, 2);
        assert_eq!(pixel_buffer.as_vec(), vec![0; 16]);
    }
}
