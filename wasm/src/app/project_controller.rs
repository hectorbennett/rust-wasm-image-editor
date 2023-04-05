use std::{cell::RefCell, rc::Rc};

use super::{
    colour::Colour,
    commands::{
        create_layer::CreateLayer,
        fill_selection::FillSelection,
        resize_canvas::ResizeCanvas,
        select_layer::SelectLayer,
        selection::{
            select_all::SelectAll, select_ellipse::SelectEllipse, select_inverse::SelectInverse,
            select_none::SelectNone, select_rect::SelectRect,
        },
        set_layer_locked::SetLayerLocked,
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

    pub fn select_layer(&mut self, uid: u64) {
        self.history
            .append(Box::new(SelectLayer::new(self.project.clone(), uid)));
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

    pub fn resize_canvas(&mut self, width: u32, height: u32) {
        self.history.append(Box::new(ResizeCanvas::new(
            self.project.clone(),
            width,
            height,
        )));
        self.history.execute();
    }

    pub fn fill_selection(&mut self, colour: &Colour) {
        self.history.append(Box::new(FillSelection::new(
            self.project.clone(),
            colour.clone(),
        )));
        self.history.execute();
    }
}
