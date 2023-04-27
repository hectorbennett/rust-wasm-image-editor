use std::{cell::RefCell, rc::Rc};

use super::{
    colour::Colour,
    commands::{
        // command::Command,
        create_layer::CreateLayer,
        delete_layer::DeleteLayer,
        fill_selection::FillSelection,
        generate_checkerboard::GenerateCheckerboard,
        import_image_as_layer::ImportImageAsLayer,
        rename_layer::RenameLayer,
        reorder_layers::ReorderLayers,
        resize_canvas::ResizeCanvas,
        select_layer::SelectLayer,
        selection::{
            fuzzy_select::FuzzySelect, select_all::SelectAll, select_ellipse::SelectEllipse,
            select_inverse::SelectInverse, select_none::SelectNone, select_rect::SelectRect,
        },
        set_layer_locked::SetLayerLocked,
        set_layer_position::SetLayerPosition,
        set_layer_visible::SetLayerVisible,
    },
    history::History,
    project::Project,
    workspace::Workspace,
};

pub struct ProjectController {
    pub project: Rc<RefCell<Project>>,
    pub history: History,
    pub workspace: Workspace,
}

// Layers
impl ProjectController {
    // pub fn execute_command(&mut self, command: Box<dyn Command>) {
    //     self.history.append(command);
    //     self.project.borrow_mut().recalculate_buffer();
    // }

    pub fn create_layer(&mut self) {
        self.history
            .append(Box::new(CreateLayer::new(self.project.clone())));
    }

    pub fn delete_layer(&mut self, uid: u64) {
        self.history
            .append(Box::new(DeleteLayer::new(self.project.clone(), uid)));
    }

    pub fn select_layer(&mut self, uid: u64) {
        self.history
            .append(Box::new(SelectLayer::new(self.project.clone(), uid)));
    }

    pub fn rename_layer(&mut self, uid: u64, name: &str) {
        self.history
            .append(Box::new(RenameLayer::new(self.project.clone(), uid, name)));
    }

    pub fn set_layer_visible(&mut self, uid: u64, visible: bool) {
        self.history.append(Box::new(SetLayerVisible::new(
            self.project.clone(),
            uid,
            visible,
        )));
    }

    pub fn set_layer_locked(&mut self, uid: u64, locked: bool) {
        self.history.append(Box::new(SetLayerLocked::new(
            self.project.clone(),
            uid,
            locked,
        )));
    }

    pub fn reeorder_layers(&mut self, uids_in_order: Vec<u64>) {
        self.history.append(Box::new(ReorderLayers::new(
            self.project.clone(),
            uids_in_order,
        )))
    }

    pub fn move_active_layer(&mut self, delta_x: i32, delta_y: i32) {
        let pos_x: i32 = delta_x
            + self
                .project
                .borrow_mut()
                .get_active_layer_mut()
                .unwrap()
                .left;
        let pos_y: i32 = delta_y
            + self
                .project
                .borrow_mut()
                .get_active_layer_mut()
                .unwrap()
                .top;
        self.set_active_layer_position(pos_x, pos_y);
    }

    pub fn set_active_layer_position(&mut self, x: i32, y: i32) {
        self.history
            .append(Box::new(SetLayerPosition::new(self.project.clone(), x, y)));
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
    }

    pub fn select_ellipse(&mut self, x: u32, y: u32, width: u32, height: u32) {
        self.history.append(Box::new(SelectEllipse::new(
            self.project.clone(),
            x,
            y,
            width,
            height,
        )));
    }

    pub fn select_all(&mut self) {
        self.history
            .append(Box::new(SelectAll::new(self.project.clone())));
    }

    pub fn select_none(&mut self) {
        self.history
            .append(Box::new(SelectNone::new(self.project.clone())));
    }

    pub fn select_inverse(&mut self) {
        self.history
            .append(Box::new(SelectInverse::new(self.project.clone())));
    }

    pub fn fuzzy_select(&mut self, project_x: u32, project_y: u32) {
        self.history.append(Box::new(FuzzySelect::new(
            self.project.clone(),
            project_x,
            project_y,
        )));
    }
}

impl ProjectController {
    pub fn new(project: Project, history: History) -> ProjectController {
        let p = Rc::new(RefCell::new(project));
        let workspace = Workspace::new(Rc::clone(&p));
        ProjectController {
            project: p,
            history,
            workspace,
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
    }

    pub fn fill_selection(&mut self, colour: &Colour) {
        self.history
            .append(Box::new(FillSelection::new(self.project.clone(), *colour)));
    }

    pub fn generate_checkerboard(&mut self) {
        self.history
            .append(Box::new(GenerateCheckerboard::new(self.project.clone())));
    }

    pub fn import_image_as_layer(&mut self, bytes: Vec<u8>) {
        self.history.append(Box::new(ImportImageAsLayer::new(
            self.project.clone(),
            bytes,
        )));
    }
}
