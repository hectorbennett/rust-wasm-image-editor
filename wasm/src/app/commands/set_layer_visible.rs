use std::{cell::RefCell, rc::Rc};

use crate::app::{commands::command::Command, project::Project};

pub struct SetLayerVisible {
    project: Rc<RefCell<Project>>,
    layer_uid: u64,
    set_visible: bool,
}

impl SetLayerVisible {
    pub fn new(
        project: Rc<RefCell<Project>>,
        layer_uid: u64,
        set_visible: bool,
    ) -> SetLayerVisible {
        SetLayerVisible {
            project,
            layer_uid,
            set_visible,
        }
    }
}

impl Command for SetLayerVisible {
    fn name(&self) -> String {
        "Set layer visible".to_string()
    }

    fn execute(&self) {
        self.project
            .borrow_mut()
            .get_layer(self.layer_uid)
            .set_visible(self.set_visible);
    }

    fn rollback(&self) {
        self.project
            .borrow_mut()
            .get_layer(self.layer_uid)
            .set_visible(!self.set_visible);
    }
}
