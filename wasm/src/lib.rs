use api::Api;
use wasm_bindgen::prelude::*;

pub mod app;

pub mod api;

#[wasm_bindgen]
extern "C" {
    fn alert(s: &str);
}

#[wasm_bindgen]
pub fn greet() {
    alert("Hello, {{project-name}}!");
}

#[wasm_bindgen]
pub fn init_api() -> Api {
    return Api::init();
}
