use std::{cell::RefCell, rc::Rc};

use crate::app::{project::Project, selection::Selection};

use super::command::Command;

pub struct ResizeCanvas {
    project: Rc<RefCell<Project>>,

    old_width: u32,
    new_width: u32,

    old_height: u32,
    new_height: u32,

    old_selection: Selection,
}

impl ResizeCanvas {
    pub fn new(project: Rc<RefCell<Project>>, width: u32, height: u32) -> ResizeCanvas {
        let old_width = project.borrow().width;
        let old_height = project.borrow().height;
        let old_selection = project.borrow().selection.clone();
        ResizeCanvas {
            project,

            old_width,
            new_width: width,

            old_height,
            new_height: height,

            old_selection,
        }
    }
}

impl Command for ResizeCanvas {
    fn name(&self) -> String {
        "Resize canvas".to_string()
    }

    fn execute(&self) {
        self.project.borrow_mut().width = self.new_width;
        self.project.borrow_mut().height = self.new_height;
        self.project.borrow_mut().selection = Selection::new(self.new_width, self.new_height);
    }

    fn rollback(&self) {
        self.project.borrow_mut().width = self.old_width;
        self.project.borrow_mut().height = self.old_height;
        self.project.borrow_mut().selection = self.old_selection.clone();
    }
}
