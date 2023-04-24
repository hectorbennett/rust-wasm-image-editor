use image::io::Reader as ImageReader;
use std::io::Cursor;
use std::{cell::RefCell, rc::Rc};

use super::command::Command;
use crate::app::pixel_buffer::PixelBuffer;
use crate::app::project::Project;

fn image_bytes_to_pixel_buffer(bytes: &Vec<u8>) -> PixelBuffer {
    let img = ImageReader::new(Cursor::new(bytes))
        .with_guessed_format()
        .expect("Cannot guess format")
        .decode()
        .expect("Cannot decode");
    PixelBuffer::from_image(img)
}

pub struct ImportImageAsLayer {
    project: Rc<RefCell<Project>>,
    bytes: Vec<u8>,
    previous_active_layer_uid: Option<u64>,
}

impl ImportImageAsLayer {
    pub fn new(project: Rc<RefCell<Project>>, bytes: Vec<u8>) -> ImportImageAsLayer {
        let previous_active_layer_uid = project.borrow_mut().active_layer_uid;

        ImportImageAsLayer {
            project,
            previous_active_layer_uid,
            bytes,
        }
    }
}

impl Command for ImportImageAsLayer {
    fn name(&self) -> String {
        "Import image".to_string()
    }

    fn execute(&self) {
        let buffer = image_bytes_to_pixel_buffer(&self.bytes);

        let mut project = self.project.borrow_mut();
        let layer = project.create_layer();

        layer.resize(buffer.width, buffer.height);
        layer.set_buffer(buffer);

        project.recalculate_buffer();
    }

    fn rollback(&self) {
        // focus the previous active layer
        self.project.borrow_mut().active_layer_uid = self.previous_active_layer_uid;

        // delete the last added layer
        let uid = self.project.borrow_mut().layers.last().unwrap().uid;
        self.project
            .borrow_mut()
            .layers
            .retain(|layer| layer.uid != uid);

        self.project.borrow_mut().recalculate_buffer();
    }
}
