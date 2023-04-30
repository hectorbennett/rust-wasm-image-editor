use std::{cell::RefCell, rc::Rc};

use crate::app::{buffer::rgba_buffer::RgbaBuffer, colour::Colour, project::Project};

use super::command::Command;

pub struct GenerateCheckerboard {
    project: Rc<RefCell<Project>>,
    old_layer_buffer: RgbaBuffer,
}

impl GenerateCheckerboard {
    pub fn new(project: Rc<RefCell<Project>>) -> GenerateCheckerboard {
        let old_layer_buffer = project
            .borrow_mut()
            .get_active_layer_mut()
            .unwrap()
            .get_buffer()
            .clone();
        GenerateCheckerboard {
            project,
            old_layer_buffer,
        }
    }
}

impl Command for GenerateCheckerboard {
    fn name(&self) -> String {
        "Generate noise".to_string()
    }

    fn execute(&self) {
        let selection = self.project.borrow().selection.clone();

        const SIZE: u32 = 10;

        fn checkerboard(x: u32, y: u32) -> Colour {
            if ((x / SIZE) + (y / SIZE)).rem_euclid(2) == 0 {
                Colour::BLACK
            } else {
                Colour::WHITE
            }
        }

        self.project
            .borrow_mut()
            .get_active_layer_mut()
            .unwrap()
            .fill_selection_with_function(&selection, checkerboard);

        self.project.borrow_mut().recalculate_buffer();
    }

    fn rollback(&self) {
        /* TODO: Maybe in future instead of copying the buffer for the whole layer, we could copy the buffer for just the selection */
        self.project
            .borrow_mut()
            .get_active_layer_mut()
            .unwrap()
            .set_buffer(self.old_layer_buffer.clone());

        self.project.borrow_mut().recalculate_buffer();
    }
}
