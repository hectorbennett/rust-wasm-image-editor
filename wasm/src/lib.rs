use api::Api;
use wasm_bindgen::prelude::*;
extern crate console_error_panic_hook;

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
    console_error_panic_hook::set_once();
    return Api::init();
}
