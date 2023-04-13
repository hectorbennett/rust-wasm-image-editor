use std::{cell::RefCell, rc::Rc};

use crate::app::{commands::command::Command, project::Project};

pub struct SelectLayer {
    project: Rc<RefCell<Project>>,
    old_active_layer_uid: Option<u64>,
    new_active_layer_uid: u64,
}

impl SelectLayer {
    pub fn new(project: Rc<RefCell<Project>>, layer_uid: u64) -> SelectLayer {
        let old_active_layer_uid = project.borrow().active_layer_uid;
        SelectLayer {
            project,
            old_active_layer_uid,
            new_active_layer_uid: layer_uid,
        }
    }
}

impl Command for SelectLayer {
    fn execute(&self) {
        self.project
            .borrow_mut()
            .set_active_layer(Some(self.new_active_layer_uid));
    }

    fn rollback(&self) {
        self.project
            .borrow_mut()
            .set_active_layer(self.old_active_layer_uid);
    }
}
