use std::{cell::RefCell, rc::Rc};

use crate::app::{commands::command::Command, project::Project};

pub struct SetLayerLocked {
    project: Rc<RefCell<Project>>,
    layer_uid: u64,
    set_locked: bool,
}

impl SetLayerLocked {
    pub fn new(project: Rc<RefCell<Project>>, layer_uid: u64, set_locked: bool) -> SetLayerLocked {
        SetLayerLocked {
            project,
            layer_uid,
            set_locked,
        }
    }
}

impl Command for SetLayerLocked {
    fn execute(&self) {
        self.project
            .borrow_mut()
            .get_layer(self.layer_uid)
            .set_locked(self.set_locked);
    }

    fn rollback(&self) {
        self.project
            .borrow_mut()
            .get_layer(self.layer_uid)
            .set_locked(!self.set_locked);
    }
}
