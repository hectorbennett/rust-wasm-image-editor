use std::{cell::RefCell, rc::Rc};

use crate::app::{commands::command::Command, project::Project, selection::Selection};

pub struct FuzzySelect {
    project: Rc<RefCell<Project>>,
    old_selection: Selection,
    project_x: u32,
    project_y: u32,
}

impl FuzzySelect {
    pub fn new(project: Rc<RefCell<Project>>, project_x: u32, project_y: u32) -> FuzzySelect {
        let old_selection = project.borrow().selection.clone();
        FuzzySelect {
            project,
            old_selection,
            project_x,
            project_y,
        }
    }
}

impl Command for FuzzySelect {
    fn name(&self) -> String {
        "Fuzzy select".to_string()
    }

    fn execute(&self) {
        let layer = self.project.borrow().get_active_layer().unwrap().clone();

        self.project
            .borrow_mut()
            .selection
            .fuzzy_select(&layer, self.project_x, self.project_y);
    }

    fn rollback(&self) {
        self.project.borrow_mut().selection = self.old_selection.clone();
    }
}
