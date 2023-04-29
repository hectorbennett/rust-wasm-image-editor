use std::ops::RangeInclusive;

use serde::{Deserialize, Serialize};

use super::buffer_iterator::{BufferIterator, BufferIteratorMut};

#[derive(Clone, Default, Debug, Serialize, Deserialize)]
pub struct Buffer<const N: usize> {
    pub width: u32,
    pub height: u32,
    data: Vec<u8>,
}

impl<const N: usize> Buffer<N> {
    pub fn new(width: u32, height: u32) -> Buffer<N> {
        Buffer {
            width,
            height,
            data: vec![0; (width as u32 * height as u32) as usize * N],
        }
    }

    pub fn new_with_data(width: u32, height: u32, data: Vec<u8>) -> Buffer<N> {
        Buffer {
            width,
            height,
            data,
        }
    }

    pub fn get_pixel_index(&self, x: u32, y: u32) -> usize {
        let num_channels = N;
        ((y * self.width) + x) as usize * num_channels
    }

    pub fn get_pixel_range(&self, x: u32, y: u32) -> RangeInclusive<usize> {
        let index = self.get_pixel_index(x, y);
        index..=index + N - 1
    }

    pub fn get_pixel(&self, x: u32, y: u32) -> [u8; N] {
        let range = self.get_pixel_range(x, y);
        self.data[range].try_into().unwrap()
    }

    pub fn get_pixel_mut(&mut self, x: u32, y: u32) -> &mut [u8; N] {
        let range = self.get_pixel_range(x, y);
        let slice = &mut self.data[range];
        slice.try_into().unwrap()
    }

    pub fn set_pixel(&mut self, x: u32, y: u32, pixel: [u8; N]) {
        let p = self.get_pixel_mut(x, y);
        *p = pixel;
    }

    pub fn pixels(&self) -> BufferIterator<N> {
        BufferIterator::new(self)
    }

    pub fn pixels_mut(&mut self) -> BufferIteratorMut<N> {
        BufferIteratorMut::new(self)
    }

    pub fn as_vec(&self) -> &Vec<u8> {
        &self.data
    }

    pub fn set_data(&mut self, data: Vec<u8>) {
        self.data = data;
    }

    pub fn crop(&mut self, left: u32, top: u32, right: u32, bottom: u32) {
        // create a new buffer
        let new_width: u32 = right - left;
        let new_height: u32 = bottom - top;
        let mut new_buffer = Self::new(new_width, new_height);

        (left..right).for_each(|x| {
            (top..bottom).for_each(|y| {
                let pixel = self.get_pixel_mut(x, y);
                new_buffer.set_pixel(x, y, *pixel)
            })
        });
        self.width = new_width;
        self.height = new_height;
        self.data = new_buffer.data;
    }
}

pub type AlphaBuffer = Buffer<1>;

#[test]
fn test_get_pixel_index() {
    let rgba_buffer: Buffer<4> = Buffer::new(2, 2);
    assert_eq!(rgba_buffer.get_pixel_index(0, 0), 0);
    assert_eq!(rgba_buffer.get_pixel_index(1, 0), 4);
    assert_eq!(rgba_buffer.get_pixel_index(0, 1), 8);
    assert_eq!(rgba_buffer.get_pixel_index(1, 1), 12);
}

#[test]
fn get_pixel_range() {
    let rgba_buffer: Buffer<4> = Buffer::new(2, 2);
    assert_eq!(rgba_buffer.get_pixel_range(0, 1), (8..=11));
}

#[test]
fn test_get_pixel() {
    let rgba_buffer: Buffer<4> = Buffer::new(2, 2);
    assert_eq!(rgba_buffer.get_pixel(1, 1), [0, 0, 0, 0]);
}

#[test]
fn test_pixels() {
    let alpha_buffer = AlphaBuffer::new(2, 2);

    let mut result = vec![];
    for (x, y, pixel) in alpha_buffer.pixels() {
        result.push((x, y, pixel))
    }
    assert_eq!(result, [(0, 0, [0]), (1, 0, [0]), (0, 1, [0]), (1, 1, [0])]);
}

#[test]
fn test_pixels_mut() {
    let mut alpha_buffer = AlphaBuffer::new(2, 2);

    for (x, y, pixel) in alpha_buffer.pixels_mut() {
        *pixel = [(x + y).try_into().unwrap()]
    }
    assert_eq!(alpha_buffer.as_vec(), &vec![0, 1, 1, 2]);
}

#[test]
fn test_as_vec() {
    let buffer: Buffer<2> = Buffer::new(2, 2);
    assert_eq!(buffer.as_vec(), &vec![0; 2 * 2 * 2]);
}

#[test]
fn test_get_pixel_mut() {
    let mut buffer: Buffer<3> = Buffer::new(2, 2);
    let p = buffer.get_pixel_mut(1, 1);
    *p = [100, 100, 100];

    let result = vec![0, 0, 0, 0, 0, 0, 0, 0, 0, 100, 100, 100];
    assert_eq!(buffer.as_vec(), &result);
}

#[test]
fn test_set_pixel() {
    let mut buffer: Buffer<3> = Buffer::new(2, 2);
    buffer.set_pixel(0, 1, [1, 1, 1]);

    assert_eq!(buffer.as_vec(), &vec![0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0]);
}

#[test]
fn test_set_data() {
    let mut buffer: Buffer<2> = Buffer::new(2, 2);
    buffer.set_data(vec![3; 2 * 2 * 2]);
    assert_eq!(buffer.as_vec(), &vec![3; 2 * 2 * 2])
}
