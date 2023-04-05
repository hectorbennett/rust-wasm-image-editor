use std::{cell::RefCell, rc::Rc};

use crate::app::{commands::command::Command, project::Project, selection::Selection};

pub struct SelectInverse {
    project: Rc<RefCell<Project>>,
    old_selection: Selection,
}

impl SelectInverse {
    pub fn new(project: Rc<RefCell<Project>>) -> SelectInverse {
        let old_selection = project.borrow().selection.clone();
        SelectInverse {
            project,
            old_selection,
        }
    }
}

impl Command for SelectInverse {
    fn execute(&self) {
        self.project.borrow_mut().selection.select_inverse();
    }

    fn rollback(&self) {
        /* TODO: Maybe in future instead of copying the buffer for the whole layer, we could copy the buffer for just the selection */
        self.project.borrow_mut().selection = self.old_selection.clone();
    }
}
