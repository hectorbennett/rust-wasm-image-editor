use wasm_bindgen::{Clamped, JsCast};
use web_sys::CanvasRenderingContext2d;
use web_sys::Document;
use web_sys::HtmlCanvasElement;
use web_sys::ImageData;

use crate::app::workspace::Workspace;

fn window() -> web_sys::Window {
    web_sys::window().expect("no global `window` exists")
}

fn document() -> Document {
    window()
        .document()
        .expect("should have a document on window")
}

fn get_canvas(canvas_id: &str) -> HtmlCanvasElement {
    document()
        .get_element_by_id(canvas_id)
        .expect("Should have a canvas element")
        .dyn_into::<HtmlCanvasElement>()
        .expect("Should have a canvas element")
}

pub struct Canvas {
    canvas: HtmlCanvasElement,
}

impl Canvas {
    pub fn new(canvas_id: &str) -> Canvas {
        Canvas {
            canvas: get_canvas(canvas_id),
        }
    }

    pub fn context(&self) -> CanvasRenderingContext2d {
        self.canvas
            .get_context("2d")
            .unwrap()
            .unwrap()
            .dyn_into::<CanvasRenderingContext2d>()
            .expect("Should have a canvas rendering context")
    }

    pub fn render_workspace(&self, workspace: &mut Workspace) {
        let width: u32 = self.canvas.width();
        let height: u32 = self.canvas.height();
        workspace.resize(width, height);
        let v = workspace.to_vec();
        if v.is_empty() {
            return;
        }
        let data = ImageData::new_with_u8_clamped_array(Clamped(&v), workspace.width).unwrap();

        let _result = self.context().put_image_data(&data, 0.0, 0.0);
    }
}
