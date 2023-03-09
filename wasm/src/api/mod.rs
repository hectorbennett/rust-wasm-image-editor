use crate::app::{colour::Colour, layer::Layer};

use super::app::App;
use wasm_bindgen::{prelude::wasm_bindgen, Clamped, JsValue};
use web_sys::ImageData;
extern crate console_error_panic_hook;
use wasm_bindgen::JsCast;
pub mod serialize;

#[wasm_bindgen]
pub struct Api {
    app: App,
    canvas_id: String,
    canvas_inited: bool,
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
        Api {
            app: App::new(),
            canvas_inited: false,
            canvas_id: "".to_string(),
        }
    }

    pub fn init_canvas(&mut self, canvas_id: String) {
        self.canvas_id = canvas_id;
        self.canvas_inited = true;
    }

    pub fn set_active_project(&mut self, project_uid: u64) {
        self.app.set_active_project(Some(project_uid));
    }

    pub fn clear_active_project(&mut self) {
        self.app.set_active_project(None);
    }

    pub fn create_project(&mut self, name: &str, width: u32, height: u32) -> u64 {
        let project = self.app.new_project();
        project.set_name(name);
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
        self.render_to_canvas();
    }

    pub fn create_layer(&mut self, name: &str, width: u32, height: u32) -> u64 {
        let _project = self.app.get_active_project();
        match _project {
            None => 0,
            Some(project) => {
                let layer = project.new_layer();
                layer.set_name(name);
                layer.resize(width, height);
                layer.uid
            }
        }
    }

    pub fn fill_selection(&mut self) {
        let selection = self.app.get_active_project().unwrap().selection.clone();
        let colour = self.app.primary_colour;

        let layer = self
            .app
            .get_active_project()
            .unwrap()
            .get_active_layer()
            .unwrap();

        layer.fill_selection(&selection, &colour);
        self.render_to_canvas();
    }

    pub fn set_primary_colour(&mut self, red: u8, green: u8, blue: u8, alpha: u8) {
        self.app.primary_colour = Colour::from_rgba(red, green, blue, alpha);
        self.render_to_canvas();
    }

    pub fn select_rect(&mut self, x: u32, y: u32, width: u32, height: u32) {
        self.app
            .get_active_project()
            .unwrap()
            .selection
            .select_rect(x, y, width, height);
        self.render_to_canvas();
    }

    pub fn invert_selection(&mut self) {
        self.app
            .get_active_project()
            .unwrap()
            .selection
            .invert_selection();
        self.render_to_canvas();
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

    pub fn get_pixel(&mut self, x: u32, y: u32) -> Vec<u8> {
        self.app
            .get_active_project()
            .unwrap()
            .get_compiled_pixel(x, y)
            .to_vec()
    }

    pub fn get_layer_thumbnail(&mut self, layer_uid: u64) -> Clamped<Vec<u8>> {
        let img = self.get_layer(layer_uid).unwrap().get_thumbnail();
        Clamped(img.into_vec())
    }

    #[wasm_bindgen(getter)]
    pub fn state(&self) -> JsValue {
        serialize::ApiSerializer::to_json(&self.app)
    }

    pub fn render_to_canvas(&mut self) {
        if !self.canvas_inited {
            return;
        }
        let document = web_sys::window().unwrap().document().unwrap();
        let canvas = document.get_element_by_id("wasm-canvas").unwrap();

        let canvas: web_sys::HtmlCanvasElement = canvas
            .dyn_into::<web_sys::HtmlCanvasElement>()
            .map_err(|_| ())
            .unwrap();

        let context = canvas
            .get_context("2d")
            .unwrap()
            .unwrap()
            .dyn_into::<web_sys::CanvasRenderingContext2d>()
            .unwrap();

        let image = self.app.get_active_project().unwrap().get_image();

        let data = ImageData::new_with_u8_clamped_array_and_sh(
            Clamped(image.as_raw()),
            image.width(),
            image.height(),
        )
        .unwrap();

        let _result = context.put_image_data(&data, 0.0, 0.0);
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
