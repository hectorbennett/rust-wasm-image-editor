use std::{cell::RefCell, rc::Rc};

use super::{
    colour::Colour,
    commands::{
        create_layer::CreateLayer,
        delete_layer::DeleteLayer,
        fill_selection::FillSelection,
        rename_layer::RenameLayer,
        resize_canvas::ResizeCanvas,
        select_layer::SelectLayer,
        selection::{
            select_all::SelectAll, select_ellipse::SelectEllipse, select_inverse::SelectInverse,
            select_none::SelectNone, select_rect::SelectRect,
        },
        set_layer_locked::SetLayerLocked,
        set_layer_position::SetLayerPosition,
        set_layer_visible::SetLayerVisible,
    },
    history::History,
    project::Project,
};

pub struct ProjectController {
    pub project: Rc<RefCell<Project>>,
    pub history: History,
}

// Layers
impl ProjectController {
    pub fn create_layer(&mut self) {
        self.history
            .append(Box::new(CreateLayer::new(self.project.clone())));
        self.history.execute();
    }

    pub fn delete_layer(&mut self, uid: u64) {
        self.history
            .append(Box::new(DeleteLayer::new(self.project.clone(), uid)));
        self.history.execute();
    }

    pub fn select_layer(&mut self, uid: u64) {
        self.history
            .append(Box::new(SelectLayer::new(self.project.clone(), uid)));
        self.history.execute();
    }

    pub fn rename_layer(&mut self, uid: u64, name: &str) {
        self.history
            .append(Box::new(RenameLayer::new(self.project.clone(), uid, name)));
        self.history.execute();
    }

    pub fn set_layer_visibile(&mut self, uid: u64, visible: bool) {
        self.history.append(Box::new(SetLayerVisible::new(
            self.project.clone(),
            uid,
            visible,
        )));
        self.history.execute();
    }

    pub fn set_layer_locked(&mut self, uid: u64, locked: bool) {
        self.history.append(Box::new(SetLayerLocked::new(
            self.project.clone(),
            uid,
            locked,
        )));
        self.history.execute();
    }

    pub fn move_active_layer(&mut self, move_x: i32, move_y: i32) {
        let pos_x: i32 = move_x + self.project.borrow_mut().get_active_layer_mut().unwrap().left;
        let pos_y: i32 = move_y + self.project.borrow_mut().get_active_layer_mut().unwrap().top;
        self.set_active_layer_position(pos_x, pos_y);
    }

    pub fn set_active_layer_position(&mut self, x: i32, y: i32) {
        self.history
            .append(Box::new(SetLayerPosition::new(self.project.clone(), x, y)));
        self.history.execute();
    }
}

// Selection
impl ProjectController {
    pub fn select_rect(&mut self, x: u32, y: u32, width: u32, height: u32) {
        self.history.append(Box::new(SelectRect::new(
            self.project.clone(),
            x,
            y,
            width,
            height,
        )));
        self.history.execute();
    }

    pub fn select_ellipse(&mut self, x: u32, y: u32, width: u32, height: u32) {
        self.history.append(Box::new(SelectEllipse::new(
            self.project.clone(),
            x,
            y,
            width,
            height,
        )));
        self.history.execute();
    }

    pub fn select_all(&mut self) {
        self.history
            .append(Box::new(SelectAll::new(self.project.clone())));
        self.history.execute();
    }

    pub fn select_none(&mut self) {
        self.history
            .append(Box::new(SelectNone::new(self.project.clone())));
        self.history.execute();
    }

    pub fn select_inverse(&mut self) {
        self.history
            .append(Box::new(SelectInverse::new(self.project.clone())));
        self.history.execute();
    }
}

impl ProjectController {
    pub fn new(project: Project, history: History) -> ProjectController {
        ProjectController {
            project: Rc::new(RefCell::new(project)),
            history,
        }
    }

    pub fn undo(&mut self) {
        self.history.undo();
    }

    pub fn redo(&mut self) {
        self.history.redo();
    }

    pub fn resize_canvas(&mut self, width: u32, height: u32) {
        self.history.append(Box::new(ResizeCanvas::new(
            self.project.clone(),
            width,
            height,
        )));
        self.history.execute();
    }

    pub fn fill_selection(&mut self, colour: &Colour) {
        self.history
            .append(Box::new(FillSelection::new(self.project.clone(), *colour)));
        self.history.execute();
    }
}
