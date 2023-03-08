use crate::app::{colour::Colour, layer::Layer};

use super::app::App;
use wasm_bindgen::{prelude::wasm_bindgen, Clamped, JsValue};
extern crate console_error_panic_hook;

pub mod serialize;

#[wasm_bindgen]
pub struct Api {
    app: App,
}

impl Api {
    pub fn get_layer(&mut self, layer_uid: u64) -> Option<&mut Layer> {
        let _project = self.app.get_active_project();
        match _project {
            None => None,
            Some(project) => {
                return Some(project.get_layer(layer_uid));
            }
        }
    }
}

#[wasm_bindgen]
impl Api {
    #[wasm_bindgen(constructor)]
    pub fn init() -> Api {
        console_error_panic_hook::set_once();
        Api { app: App::new() }
    }

    pub fn set_active_project(&mut self, project_uid: u64) {
        self.app.set_active_project(Some(project_uid));
    }

    pub fn clear_active_project(&mut self) {
        self.app.set_active_project(None);
    }

    pub fn create_project(&mut self, name: String, width: u32, height: u32) -> u64 {
        let project = self.app.new_project();
        project.set_name(&name);
        project.resize_canvas(width, height);
        let layer = project.new_layer();
        layer.set_name("Background");
        layer.resize(width, height);
        project.uid
    }

    pub fn resize_canvas(&mut self, width: u32, height: u32) {
        self.app
            .get_active_project()
            .unwrap()
            .resize_canvas(width, height);
    }

    pub fn create_layer(&mut self, name: String, width: u32, height: u32) -> u64 {
        let _project = self.app.get_active_project();
        match _project {
            None => 0,
            Some(project) => {
                let layer = project.new_layer();
                layer.set_name(&name);
                layer.resize(width, height);
                layer.uid
            }
        }
    }

    pub fn fill_selection(&mut self) {
        let _project = self.app.get_active_project().unwrap();
        // project.fill_selection(self.app.primary_colour);
        // let selection: &mut Selection = &mut project.selection;
        // let layer = project.get_active_layer().unwrap();
        // layer.fill_s
        // selection.fill_layer(layer, self.app.primary_colour);
        // layer.fill_selection(selection, self.app.primary_colour)
        //    .fill_selection();
    }

    pub fn set_primary_colour(&mut self, red: u8, green: u8, blue: u8, alpha: u8) {
        self.app.primary_colour = Colour::from_rgba(red, green, blue, alpha);
    }

    pub fn select_rect(&mut self, x: u32, y: u32, width: u32, height: u32) {
        self.app
            .get_active_project()
            .unwrap()
            .selection
            .select_rect(x, y, width, height);
    }

    pub fn set_active_layer(&mut self, layer_uid: u64) {
        self.app
            .get_active_project()
            .unwrap()
            .set_active_layer(Some(layer_uid));
    }

    pub fn set_layer_visibile(&mut self, layer_uid: u64, visible: bool) {
        let _layer = self.get_layer(layer_uid);
        match _layer {
            None => (),
            Some(layer) => layer.set_visible(visible),
        }
    }

    pub fn set_layer_locked(&mut self, layer_uid: u64, locked: bool) {
        let _layer = self.get_layer(layer_uid);
        match _layer {
            None => (),
            Some(layer) => layer.set_locked(locked),
        }
    }

    pub fn fill_rect(
        &mut self,
        layer_uid: u64,
        colour: &[u8],
        left: u32,
        top: u32,
        width: u32,
        height: u32,
    ) {
        let _layer = self.get_layer(layer_uid);
        match _layer {
            None => (),
            Some(layer) => layer.fill_rect(get_colour(colour), left, top, width, height),
        }
    }

    #[wasm_bindgen(getter)]
    pub fn image_data(&mut self) -> Clamped<Vec<u8>> {
        let _project = self.app.get_active_project();
        match _project {
            None => Clamped(vec![]),
            Some(project) => {
                let image = project.get_image();
                Clamped(image.into_vec())
            }
        }
    }

    pub fn get_layer_thumbnail(&mut self, layer_uid: u64) -> Clamped<Vec<u8>> {
        let img = self.get_layer(layer_uid).unwrap().get_thumbnail();
        Clamped(img.into_vec())
    }

    #[wasm_bindgen(getter)]
    pub fn state(&self) -> JsValue {
        serialize::ApiSerializer::to_json(&self.app)
    }
}

pub fn get_colour(colour: &[u8]) -> Colour {
    Colour::from_rgba(
        colour[0] as u8,
        colour[1] as u8,
        colour[2] as u8,
        colour[3] as u8,
    )
}
