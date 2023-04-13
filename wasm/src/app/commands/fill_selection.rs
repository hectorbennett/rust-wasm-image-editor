use std::{cell::RefCell, rc::Rc};

use crate::app::{colour::Colour, layer::LayerBuffer, project::Project};

use super::command::Command;

pub struct FillSelection {
    project: Rc<RefCell<Project>>,
    colour: Colour,
    old_layer_buffer: LayerBuffer,
}

impl FillSelection {
    pub fn new(project: Rc<RefCell<Project>>, colour: Colour) -> FillSelection {
        let old_layer_buffer = project
            .borrow_mut()
            .get_active_layer()
            .unwrap()
            .get_buffer()
            .clone();
        FillSelection {
            project,
            colour,
            old_layer_buffer,
        }
    }
}

impl Command for FillSelection {
    fn name(&self) -> String {
        "Fill selection".to_string()
    }

    fn execute(&self) {
        let selection = self.project.borrow().selection.clone();
        self.project
            .borrow_mut()
            .get_active_layer()
            .unwrap()
            .fill_selection(&selection, &self.colour);
    }

    fn rollback(&self) {
        /* TODO: Maybe in future instead of copying the buffer for the whole layer, we could copy the buffer for just the selection */
        self.project
            .borrow_mut()
            .get_active_layer()
            .unwrap()
            .set_buffer(self.old_layer_buffer.clone())
    }
}
