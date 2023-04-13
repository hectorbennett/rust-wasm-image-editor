use std::{cell::RefCell, rc::Rc};

use crate::app::project::Project;

use super::command::Command;

pub struct SetName {
    project: Rc<RefCell<Project>>,
    old_name: String,
    new_name: String,
}

impl SetName {
    pub fn new(project: Rc<RefCell<Project>>, name: &str) -> SetName {
        let old_name: String = project.borrow().name.clone();
        SetName {
            project,
            old_name,
            new_name: name.into(),
        }
    }
}

impl Command for SetName {
    fn name(&self) -> String {
        "Set project name".to_string()
    }

    fn execute(&self) {
        self.project.borrow_mut().name = self.new_name.clone();
    }

    fn rollback(&self) {
        self.project.borrow_mut().name = self.old_name.clone();
    }
}
