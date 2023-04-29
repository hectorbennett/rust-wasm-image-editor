use super::buffer::Buffer;

pub struct BufferIterator<'a, const N: usize> {
    buffer: &'a Buffer<N>,
    x: u16,
    y: u16,
}

impl<const N: usize> BufferIterator<'_, N> {
    pub fn new(buffer: &Buffer<N>) -> BufferIterator<N> {
        BufferIterator { buffer, x: 0, y: 0 }
    }
}

impl<const N: usize> Iterator for BufferIterator<'_, N> {
    type Item = (u16, u16, [u8; N]);
    fn next(&mut self) -> Option<Self::Item> {
        // move one to the right

        // if we've gone over too far, go back to 0 and move down one row
        if self.x >= self.buffer.width {
            self.x = 0;
            self.y += 1;
        }

        if self.y >= self.buffer.height {
            return None;
        }
        let result = Some((self.x, self.y, self.buffer.get_pixel(self.x, self.y)));

        self.x += 1;
        result
    }
}

#[test]
fn test_empty_iterator() {
    let rgba_buffer: Buffer<4> = Buffer::new(0, 0);

    let mut iterator = BufferIterator::new(&rgba_buffer);

    assert_eq!(iterator.next(), None);
}

#[test]
fn test_iterator() {
    let rgba_buffer: Buffer<4> = Buffer::new(2, 2);

    let iterator = BufferIterator::new(&rgba_buffer);
    let mut result = vec![];
    for (x, y, pixel) in iterator {
        result.push((x, y, pixel))
    }
    assert_eq!(
        result,
        [
            (0, 0, [0, 0, 0, 0]),
            (1, 0, [0, 0, 0, 0]),
            (0, 1, [0, 0, 0, 0]),
            (1, 1, [0, 0, 0, 0])
        ]
    );
}
