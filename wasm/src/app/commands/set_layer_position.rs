use std::{cell::RefCell, rc::Rc};

use crate::app::{commands::command::Command, project::Project};

pub struct SetLayerPosition {
    project: Rc<RefCell<Project>>,
    old_pos: [i32; 2],
    new_pos: [i32; 2],
}

impl SetLayerPosition {
    pub fn new(project: Rc<RefCell<Project>>, x: i32, y: i32) -> SetLayerPosition {
        let old_x = project.borrow_mut().get_active_layer_mut().unwrap().left;
        let old_y = project.borrow_mut().get_active_layer_mut().unwrap().top;
        let old_pos = [old_x, old_y];
        let new_pos = [x, y];

        SetLayerPosition {
            project,
            old_pos,
            new_pos,
        }
    }
}

impl Command for SetLayerPosition {
    fn name(&self) -> String {
        "Move layer".to_string()
    }

    fn execute(&self) {
        self.project
            .borrow_mut()
            .get_active_layer_mut()
            .unwrap()
            .set_position(self.new_pos[0], self.new_pos[1]);

        self.project.borrow_mut().recalculate_buffer();
    }

    fn rollback(&self) {
        self.project
            .borrow_mut()
            .get_active_layer_mut()
            .unwrap()
            .set_position(self.old_pos[0], self.old_pos[1]);

        self.project.borrow_mut().recalculate_buffer();
    }
}

#[test]
fn test_set_layer_position() {
    let project = Rc::new(RefCell::new(Project::demo()));

    let command = SetLayerPosition::new(Rc::clone(&project), -10, -10);
    command.execute();
}
