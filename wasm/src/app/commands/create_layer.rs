use std::{cell::RefCell, rc::Rc};

use crate::app::project::Project;

use super::command::Command;

pub struct CreateLayer {
    project: Rc<RefCell<Project>>,
    previous_active_layer_uid: Option<u64>,
}

impl CreateLayer {
    pub fn new(project: Rc<RefCell<Project>>) -> CreateLayer {
        let previous_active_layer_uid = project.borrow_mut().active_layer_uid;

        CreateLayer {
            project,
            previous_active_layer_uid,
        }
    }
}

impl Command for CreateLayer {
    fn name(&self) -> String {
        "Create layer".to_string()
    }

    fn execute(&self) {
        self.project.borrow_mut().create_layer();
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
    }
}
