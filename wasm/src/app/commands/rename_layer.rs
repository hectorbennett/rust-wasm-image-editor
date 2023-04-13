use std::{cell::RefCell, rc::Rc};

use crate::app::{commands::command::Command, project::Project};

pub struct RenameLayer {
    project: Rc<RefCell<Project>>,
    layer_uid: u64,
    old_name: String,
    new_name: String,
}

impl RenameLayer {
    pub fn new(project: Rc<RefCell<Project>>, layer_uid: u64, name: &str) -> RenameLayer {
        let old_name: String = project.borrow_mut().get_layer(layer_uid).name.clone();
        RenameLayer {
            project,
            layer_uid,
            old_name,
            new_name: name.to_string(),
        }
    }
}

impl Command for RenameLayer {
    fn name(&self) -> String {
        "Rename layer".to_string()
    }

    fn execute(&self) {
        self.project
            .borrow_mut()
            .get_layer(self.layer_uid)
            .set_name(&self.new_name);
    }

    fn rollback(&self) {
        self.project
            .borrow_mut()
            .get_layer(self.layer_uid)
            .set_name(&self.old_name);
    }
}
