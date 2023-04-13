use std::{cell::RefCell, rc::Rc};

use crate::app::project::Project;

use super::command::Command;

pub struct CreateLayer {
    project: Rc<RefCell<Project>>,
}

impl CreateLayer {
    pub fn new(project: Rc<RefCell<Project>>) -> CreateLayer {
        CreateLayer { project }
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
        let uid = self.project.borrow_mut().layers.last().unwrap().uid;
        self.project.borrow_mut().delete_layer(uid);
    }
}
