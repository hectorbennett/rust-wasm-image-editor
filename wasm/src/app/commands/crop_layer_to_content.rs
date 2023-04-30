use std::{cell::RefCell, rc::Rc};

use crate::app::project::Project;

use super::command::Command;

pub struct CropLayerToContent {
    project: Rc<RefCell<Project>>,
    previous_left: i32,
    previous_top: i32,
    previous_width: u32,
    previous_height: u32,
}

impl CropLayerToContent {
    pub fn new(project: Rc<RefCell<Project>>) -> CropLayerToContent {
        let previous_left = project.borrow().get_active_layer().unwrap().left;
        let previous_top = project.borrow().get_active_layer().unwrap().top;
        let previous_width = project.borrow().get_active_layer().unwrap().width;
        let previous_height = project.borrow().get_active_layer().unwrap().height;

        CropLayerToContent {
            project,
            previous_left,
            previous_top: 0,
            previous_width: 0,
            previous_height: 0,
        }
    }
}

impl Command for CropLayerToContent {
    fn name(&self) -> String {
        "Crop layer to content".to_string()
    }

    fn execute(&self) {
        // self.project
        //     .borrow_mut()
        //     .get_active_layer()
        //     .unwrap()
        //     .crop_layer_to_content();
    }

    fn rollback(&self) {
        // self.project
        //     .borrow_mut()
        //     .get_active_layer_mut()
        //     .unwrap()
        //     .crop(
        //         self.previous_left,
        //         self.previous_top,
        //         self.previous_width,
        //         self.previous_height,
        //     );
    }
}
