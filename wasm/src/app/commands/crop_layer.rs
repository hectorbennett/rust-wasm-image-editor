use std::{cell::RefCell, rc::Rc};

use crate::app::{buffer::rgba_buffer::RgbaBuffer, colour::Colour, project::Project};

use super::command::Command;

pub struct CropLayer {
    project: Rc<RefCell<Project>>,
    x: u32,
    y: u32,
    width: u32,
    height: u32,
    old_layer_buffer: RgbaBuffer,
}

impl CropLayer {
    pub fn new(
        project: Rc<RefCell<Project>>,
        x: u32,
        y: u32,
        width: u32,
        height: u32,
    ) -> CropLayer {
        let old_layer_buffer = project
            .borrow_mut()
            .get_active_layer_mut()
            .unwrap()
            .get_buffer()
            .clone();
        CropLayer {
            project,
            x,
            y,
            width,
            height,
            old_layer_buffer,
        }
    }
}

impl Command for CropLayer {
    fn name(&self) -> String {
        "Crop layer".to_string()
    }

    fn execute(&self) {
        let selection = self.project.borrow().selection.clone();
        self.project
            .borrow_mut()
            .get_active_layer_mut()
            .unwrap()
            .crop(self.x, self.y, self.width, self.height);
        self.project.borrow_mut().recalculate_buffer();
    }

    fn rollback(&self) {
        /* TODO: Maybe in future instead of copying the buffer for the whole layer, we could copy the buffer for just the changes */
        self.project
            .borrow_mut()
            .get_active_layer_mut()
            .unwrap()
            .set_buffer(self.old_layer_buffer.clone());
        self.project.borrow_mut().recalculate_buffer();
    }
}

#[test]
fn test_crop() {
    let project = Rc::new(RefCell::new(Project::demo()));

    let command = CropLayer::new(Rc::clone(&project), 100, 100, 100, 100);
    command.execute();
}
