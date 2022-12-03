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
        return Api { app: App::new() };
    }

    pub fn set_active_project(&mut self, project_uid: u64) -> () {
        self.app.set_active_project(Some(project_uid));
    }

    pub fn clear_active_project(&mut self) -> () {
        self.app.set_active_project(None);
    }

    pub fn create_project(&mut self, name: String, width: u16, height: u16) -> u64 {
        let project = self.app.new_project();
        project.set_name(&name);
        project.resize_canvas(width, height);
        let layer = project.new_layer();
        layer.set_name("Background");
        layer.resize(width, height);
        return project.uid.clone();
    }

    pub fn create_layer(&mut self, name: String, width: u16, height: u16) -> u64 {
        let _project = self.app.get_active_project();
        match _project {
            None => 0,
            Some(project) => {
                let layer = project.new_layer();
                layer.set_name(&name);
                layer.resize(width, height);
                return layer.uid.clone();
            }
        }
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
        left: u16,
        top: u16,
        width: u16,
        height: u16,
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
                return Clamped(image.into_vec());
            }
        }
    }

    #[wasm_bindgen(getter)]
    pub fn state(&self) -> JsValue {
        return serialize::ApiSerializer::to_json(&self.app);
    }
}

pub fn get_colour(colour: &[u8]) -> Colour {
    return Colour::from_rgba(
        colour[0] as u8,
        colour[1] as u8,
        colour[2] as u8,
        colour[3] as u8,
    );
}
