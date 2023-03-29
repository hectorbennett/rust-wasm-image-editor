#![feature(test)]

use wasm::app::{colour::Colour, App};

extern crate test;

fn create_project() {
    let app: &mut App = &mut App::new();
    let project = app.new_project();
    project.resize_canvas(500, 500);
    let layer1 = project.new_layer();
    layer1.set_name("Background");
    layer1.resize(500, 500);
    let layer2 = project.new_layer();
    layer2.set_name("Layer 2");
    layer2.resize(500, 500);
    // layer2.select_rect(0, 0, 100, 100)
    project.selection.select_rect(0, 0, 100, 100);

    let selection = project.selection.clone();
    let colour = Colour::BLACK;
    // layer2.fill_selection(&selection, &colour);

    let image = project.get_image();
    println!("{:?}", image.as_raw()[0]);
}

#[bench]
fn create_and_render_project(b: &mut test::Bencher) {
    b.iter(|| {
        create_project();
    });
}
