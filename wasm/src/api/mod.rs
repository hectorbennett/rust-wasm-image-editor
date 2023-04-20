use std::vec;
use wasm_bindgen::{prelude::wasm_bindgen, Clamped, JsValue};
extern crate console_error_panic_hook;
use crate::api::canvas::Canvas;
use crate::app::{colour::Colour, timer::Timer, App};
pub mod canvas;
pub mod serialize;

#[wasm_bindgen]
pub struct Api {
    app: App,
    canvas: Option<Canvas>,
}

#[wasm_bindgen]
impl Api {
    #[wasm_bindgen(constructor)]
    pub fn init() -> Api {
        console_error_panic_hook::set_once();
        Api {
            app: App::new(),
            canvas: None,
        }
    }

    pub fn init_canvas(&mut self, canvas_id: &str) {
        let _timer = Timer::new("Api::init_canvas");
        self.canvas = Some(Canvas::new(canvas_id));
    }

    pub fn set_active_project(&mut self, project_uid: u64) {
        let _timer = Timer::new("Api::set_active_project");
        self.app.set_active_project(Some(project_uid));
    }

    pub fn clear_active_project(&mut self) {
        let _timer = Timer::new("Api::clear_active_project");
        self.app.set_active_project(None);
    }

    pub fn create_project(&mut self) -> u64 {
        let project = self.app.new_project();
        project.project.borrow().uid
    }

    pub fn resize_canvas(&mut self, width: u32, height: u32) {
        web_sys::console::time_with_label("Api::resize_canvas");
        self.app
            .get_active_project_controller_mut()
            .unwrap()
            .resize_canvas(width, height);
        web_sys::console::time_end_with_label("Api::resize_canvas");
    }

    pub fn create_layer(&mut self) -> u64 {
        let _timer = Timer::new("Api::create_layer");
        let project = self.app.get_active_project_controller_mut().unwrap();
        project.create_layer();
        project.project.borrow().layers.last().unwrap().uid
    }

    pub fn delete_layer(&mut self, layer_uid: u64) {
        let _timer = Timer::new("Api::delete_layer");
        let project = self.app.get_active_project_controller_mut().unwrap();
        project.delete_layer(layer_uid);
    }

    pub fn fill_selection(&mut self) {
        web_sys::console::time_with_label("Api::fill_selection");
        let colour = self.app.primary_colour;
        self.app
            .get_active_project_controller_mut()
            .unwrap()
            .fill_selection(&colour);
        web_sys::console::time_end_with_label("Api::fill_selection");
    }

    pub fn set_primary_colour(&mut self, red: u8, green: u8, blue: u8, alpha: u8) {
        let _timer = Timer::new("Api::set_primary_colour");
        self.app.primary_colour = Colour::from_rgba(red, green, blue, alpha);
    }

    pub fn move_active_layer(&mut self, move_x: i32, move_y: i32) {
        web_sys::console::time_with_label("Api::move_layer");
        self.app
            .get_active_project_controller_mut()
            .unwrap()
            .move_active_layer(move_x, move_y);
        web_sys::console::time_end_with_label("Api::move_layer");
    }

    pub fn select_rect(&mut self, x: u32, y: u32, width: u32, height: u32) {
        web_sys::console::time_with_label("Api::select_rect");
        self.app
            .get_active_project_controller_mut()
            .unwrap()
            .select_rect(x, y, width, height);
        web_sys::console::time_end_with_label("Api::select_rect");
    }

    pub fn select_ellipse(&mut self, x: u32, y: u32, width: u32, height: u32) {
        web_sys::console::time_with_label("Api::select_rect");
        self.app
            .get_active_project_controller_mut()
            .unwrap()
            .select_ellipse(x, y, width, height);
        web_sys::console::time_end_with_label("Api::select_rect");
    }

    pub fn select_all(&mut self) {
        web_sys::console::time_with_label("Api::select_all");
        self.app
            .get_active_project_controller_mut()
            .unwrap()
            .select_all();
        web_sys::console::time_end_with_label("Api::select_all");
    }

    pub fn select_none(&mut self) {
        web_sys::console::time_with_label("Api::select_none");
        self.app
            .get_active_project_controller_mut()
            .unwrap()
            .select_none();
        web_sys::console::time_end_with_label("Api::select_none");
    }

    pub fn select_inverse(&mut self) {
        web_sys::console::time_with_label("Api::select_inverse");
        self.app
            .get_active_project_controller_mut()
            .unwrap()
            .select_inverse();
        web_sys::console::time_end_with_label("Api::select_inverse");
    }

    pub fn set_active_layer(&mut self, layer_uid: u64) {
        web_sys::console::time_with_label("Api::set_active_layer");
        self.app
            .get_active_project_controller_mut()
            .unwrap()
            .select_layer(layer_uid);
        web_sys::console::time_end_with_label("Api::set_active_layer");
    }

    pub fn rename_layer(&mut self, layer_uid: u64, name: &str) {
        web_sys::console::time_with_label("Api::rename_layer");
        self.app
            .get_active_project_controller_mut()
            .unwrap()
            .rename_layer(layer_uid, name);
        web_sys::console::time_end_with_label("Api::rename_layer");
    }

    pub fn set_layer_visibile(&mut self, layer_uid: u64, visible: bool) {
        web_sys::console::time_with_label("Api::set_layer_visibile");
        self.app
            .get_active_project_controller_mut()
            .unwrap()
            .set_layer_visibile(layer_uid, visible);
        web_sys::console::time_end_with_label("Api::set_layer_visibile");
    }

    pub fn set_layer_locked(&mut self, layer_uid: u64, locked: bool) {
        web_sys::console::time_with_label("Api::set_layer_locked");
        self.app
            .get_active_project_controller_mut()
            .unwrap()
            .set_layer_locked(layer_uid, locked);
        web_sys::console::time_end_with_label("Api::set_layer_locked");
    }

    pub fn undo(&mut self) {
        web_sys::console::time_with_label("Api::undo");
        self.app.get_active_project_controller_mut().unwrap().undo();
        web_sys::console::time_end_with_label("Api::undo");
    }

    pub fn redo(&mut self) {
        web_sys::console::time_with_label("Api::undo");
        self.app.get_active_project_controller_mut().unwrap().redo();
        web_sys::console::time_end_with_label("Api::undo");
    }

    pub fn pick_colour(&mut self, x: u32, y: u32) -> Vec<u8> {
        let _timer = Timer::new("Api::pick_colour");
        self.app
            .get_active_project_controller_mut()
            .unwrap()
            .project
            .borrow()
            .get_pixel(x, y)
            .unwrap()
            .to_vec()
    }

    pub fn eye_dropper(&mut self, x: u32, y: u32) {
        let _timer = Timer::new("Api::eye_dropper");
        let colour = self
            .app
            .get_active_project_controller()
            .unwrap()
            .project
            .borrow()
            .get_pixel(x, y)
            .unwrap();

        self.app.primary_colour = Colour::from_rgba_array(colour);
    }

    pub fn get_layer_thumbnail(&mut self, _layer_uid: u64) -> Clamped<Vec<u8>> {
        // let _timer = Timer::new("Api::get_layer_thumbnail");
        // let _img = self.get_layer(layer_uid).unwrap().get_thumbnail();
        // Clamped(img.into_vec())
        Clamped(vec![])
    }

    #[wasm_bindgen(getter)]
    pub fn state(&self) -> JsValue {
        let _timer = Timer::new("Api::state");
        serialize::ApiSerializer::to_json(&self.app)
    }

    pub fn from_json(&mut self, json: &str) {
        self.app.open_project_from_json(json);
    }

    pub fn to_json(&mut self) -> String {
        self.app
            .get_active_project_controller_mut()
            .unwrap()
            .project
            .borrow()
            .to_json()
    }

    pub fn from_postcard(&mut self, p: Vec<u8>) {
        self.app.open_project_from_postcard(p);
    }

    pub fn to_postcard(&mut self) -> Vec<u8> {
        self.app
            .get_active_project_controller_mut()
            .unwrap()
            .project
            .borrow()
            .to_postcard()
    }

    pub fn to_png(&self) -> Vec<u8> {
        self.app
            .get_active_project_controller()
            .unwrap()
            .project
            .borrow()
            .to_png()
    }

    pub fn scroll_workspace(&mut self, delta_x: i32, delta_y: i32) {
        self.app
            .get_active_project_controller_mut()
            .unwrap()
            .workspace
            .scroll(delta_x, delta_y);
    }

    pub fn set_workspace_position(&mut self, x: i32, y: i32) {
        self.app
            .get_active_project_controller_mut()
            .unwrap()
            .workspace
            .set_position(x, y);
    }

    pub fn zoom_workspace(&mut self, zoom_delta: i32, around_x: u32, around_y: u32) {
        self.app
            .get_active_project_controller_mut()
            .unwrap()
            .workspace
            .zoom(zoom_delta, around_x, around_y);
    }

    pub fn set_workspace_zoom(&mut self, zoom: u32) {
        self.app
            .get_active_project_controller_mut()
            .unwrap()
            .workspace
            .set_zoom(zoom);
    }

    pub fn render_to_canvas(&mut self) {
        match &self.canvas {
            None => (),
            Some(canvas) => {
                // let _timer = Timer::new("Api::render_to_canvas");
                let workspace = &mut self
                    .app
                    .get_active_project_controller_mut()
                    .unwrap()
                    .workspace;
                canvas.render_workspace(workspace)
            }
        }
    }
}
