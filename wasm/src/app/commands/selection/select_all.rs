use std::{cell::RefCell, rc::Rc};

use crate::app::{commands::command::Command, project::Project, selection::Selection};

pub struct SelectAll {
    project: Rc<RefCell<Project>>,
    old_selection: Selection,
}

impl SelectAll {
    pub fn new(project: Rc<RefCell<Project>>) -> SelectAll {
        let old_selection = project.borrow().selection.clone();
        SelectAll {
            project,
            old_selection,
        }
    }
}

impl Command for SelectAll {
    fn name(&self) -> String {
        "Select all".to_string()
    }

    fn execute(&self) {
        self.project.borrow_mut().selection.select_all();
    }

    fn rollback(&self) {
        /* TODO: Maybe in future instead of copying the buffer for the whole layer, we could copy the buffer for just the selection */
        self.project.borrow_mut().selection = self.old_selection.clone();
    }
}
