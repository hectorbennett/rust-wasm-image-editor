use std::{cell::RefCell, rc::Rc};

use crate::app::project::Project;

use super::command::Command;

pub struct ReorderLayers {
    project: Rc<RefCell<Project>>,
    previous_order: Vec<u64>,
    new_order: Vec<u64>,
}

impl ReorderLayers {
    pub fn new(project: Rc<RefCell<Project>>, uids_in_order: Vec<u64>) -> ReorderLayers {
        let previous_order: Vec<u64> = project
            .borrow_mut()
            .layers
            .iter()
            .map(|layer| layer.uid)
            .collect();

        ReorderLayers {
            project,
            previous_order,
            new_order: uids_in_order,
        }
    }
}

impl Command for ReorderLayers {
    fn name(&self) -> String {
        "Reeorder layers".to_string()
    }

    fn execute(&self) {
        self.project.borrow_mut().reeorder_layers(&self.new_order);
        self.project.borrow_mut().recalculate_buffer();
    }

    fn rollback(&self) {
        self.project
            .borrow_mut()
            .reeorder_layers(&self.previous_order);
        self.project.borrow_mut().recalculate_buffer();
    }
}
