use std::{cell::RefCell, rc::Rc};

use crate::app::layer::Layer;
use crate::app::project::Project;

use super::command::Command;

pub struct DeleteLayer {
    project: Rc<RefCell<Project>>,
    layer_uid: u64,
    layer: Layer,
    layer_position: usize,
    previous_active_layer_uid: Option<u64>,
}

impl DeleteLayer {
    pub fn new(project: Rc<RefCell<Project>>, layer_uid: u64) -> DeleteLayer {
        let previous_active_layer_uid = project.borrow_mut().active_layer_uid;

        // Get position of the layer
        let layer_position = project
            .borrow_mut()
            .layers
            .iter()
            .position(|layer| layer.uid == layer_uid)
            .unwrap();

        // Clone the layer
        let layer: Layer = project
            .borrow_mut()
            .layers
            .iter()
            .find(|&layer| layer.uid == layer_uid)
            .cloned()
            .unwrap();

        DeleteLayer {
            project,
            layer_uid,
            layer_position,
            layer,
            previous_active_layer_uid,
        }
    }
}

impl Command for DeleteLayer {
    fn name(&self) -> String {
        "Delete layer".to_string()
    }

    fn execute(&self) {
        // delete the layer
        self.project
            .borrow_mut()
            .layers
            .retain(|layer| layer.uid != self.layer_uid);

        // if the layer we just deleted was the active layer, focus the last layer
        if self.project.borrow().active_layer_uid == Some(self.layer_uid) {
            let last_element_uid = self.project.borrow().layers.last().map(|layer| layer.uid);
            self.project.borrow_mut().set_active_layer(last_element_uid);
        }

        self.project.borrow_mut().recalculate_buffer();
    }

    fn rollback(&self) {
        // Add the layer back
        self.project
            .borrow_mut()
            .layers
            .insert(self.layer_position, self.layer.clone());

        // refocus the previous focused layer
        // previous_active_layer_uid
        self.project
            .borrow_mut()
            .set_active_layer(self.previous_active_layer_uid);

        self.project.borrow_mut().recalculate_buffer();
    }
}
