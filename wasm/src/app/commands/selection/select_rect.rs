use std::{cell::RefCell, rc::Rc};

use crate::app::{commands::command::Command, project::Project, selection::Selection};

pub struct SelectRect {
    project: Rc<RefCell<Project>>,
    old_selection: Selection,
    x: u32,
    y: u32,
    width: u32,
    height: u32,
}

impl SelectRect {
    pub fn new(
        project: Rc<RefCell<Project>>,
        x: u32,
        y: u32,
        width: u32,
        height: u32,
    ) -> SelectRect {
        let old_selection = project.borrow().selection.clone();
        SelectRect {
            project,
            old_selection,
            x,
            y,
            width,
            height,
        }
    }
}

impl Command for SelectRect {
    fn execute(&self) {
        self.project
            .borrow_mut()
            .selection
            .select_rect(self.x, self.y, self.width, self.height);
    }

    fn rollback(&self) {
        /* TODO: Maybe in future instead of copying the buffer for the whole layer, we could copy the buffer for just the selection */
        self.project.borrow_mut().selection = self.old_selection.clone();
    }
}
