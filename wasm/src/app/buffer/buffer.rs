use std::ops::RangeInclusive;

use super::buffer_iterator::BufferIterator;

pub struct Buffer<const N: usize> {
    pub width: u16,
    pub height: u16,
    data: Vec<u8>,
}

impl<const N: usize> Buffer<N> {
    pub fn new(width: u16, height: u16) -> Buffer<N> {
        Buffer {
            width,
            height,
            data: vec![0; (width * height) as usize * N],
        }
    }

    pub fn new_with_data(width: u16, height: u16, data: Vec<u8>) -> Buffer<N> {
        Buffer {
            width,
            height,
            data,
        }
    }

    pub fn get_pixel_index(&self, x: u16, y: u16) -> usize {
        let num_channels = N;
        ((y * self.width) + x) as usize * num_channels
    }

    pub fn get_pixel_range(&self, x: u16, y: u16) -> RangeInclusive<usize> {
        let index = self.get_pixel_index(x, y);
        index..=index + N - 1
    }

    pub fn get_pixel(&self, x: u16, y: u16) -> [u8; N] {
        let range = self.get_pixel_range(x, y);
        self.data[range].try_into().unwrap()
    }

    pub fn get_pixel_mut(&mut self, x: u16, y: u16) -> &mut [u8; N] {
        let range = self.get_pixel_range(x, y);
        let slice = &mut self.data[range];
        slice.try_into().unwrap()
    }

    pub fn set_pixel(&mut self, x: u16, y: u16, pixel: [u8; N]) {
        let p = self.get_pixel_mut(x, y);
        *p = pixel;
    }

    pub fn pixels(&self) -> BufferIterator<N> {
        BufferIterator::new(self)
    }

    pub fn as_vec(&self) -> &Vec<u8> {
        &self.data
    }

    pub fn crop(&mut self, left: u16, top: u16, right: u16, bottom: u16) {
        // create a new buffer
        let new_width: u16 = right - left;
        let new_height: u16 = bottom - top;
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
    assert_eq!(rgba_buffer.get_pixel_range(0, 1), (4..=7));
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
fn set_pixel() {
    let mut buffer: Buffer<3> = Buffer::new(2, 2);
    buffer.set_pixel(0, 1, [1, 1, 1]);

    assert_eq!(buffer.as_vec(), &vec![0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0]);
}
