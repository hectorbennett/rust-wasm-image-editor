use std::{cell::RefCell, rc::Rc};

use crate::app::project::Project;

use super::command::Command;

pub struct CropLayerToContent {
    project: Rc<RefCell<Project>>,
    previous_active_layer_uid: Option<u64>,
}

impl CropLayerToContent {
    pub fn new(project: Rc<RefCell<Project>>) -> CropLayerToContent {
        let previous_active_layer_uid = project.borrow_mut().active_layer_uid;

        CropLayerToContent {
            project,
            previous_active_layer_uid,
        }
    }
}

impl Command for CropLayerToContent {
    fn name(&self) -> String {
        "Crop layer to content".to_string()
    }

    fn execute(&self) {
        self.project.borrow_mut().create_layer();
    }

    fn rollback(&self) {
        // focus the previous active layer
        self.project.borrow_mut().active_layer_uid = self.previous_active_layer_uid;

        // delete the last added layer
        let uid = self.project.borrow_mut().layers.last().unwrap().uid;
        self.project
            .borrow_mut()
            .layers
            .retain(|layer| layer.uid != uid);
    }
}

#[test]
fn test_from_coords() {
    // create a new project
    let mut project = Rc::new(RefCell::new(Project::demo()));
    CropLayerToContent::new(Rc::clone(&project));
    s.select_rect(1, 1, 1, 1);

    assert_eq!(s.from_coords(0, 0), 0);
    assert_eq!(s.from_coords(1, 1), 255);
}
