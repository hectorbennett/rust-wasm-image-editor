use std::{cell::RefCell, rc::Rc};

use wasm::app::{
    commands::{resize_canvas::ResizeCanvas, set_name::SetName},
    history::History,
    project::Project,
};
use wasm_bindgen_test::*;

#[test]
fn it_adds_two() {
    assert_eq!(4, 2 + 2);
}

#[wasm_bindgen_test]
fn test_fill_rectangle() {
    // let mut api: Api = Api::init();
    // let project_uid = api.create_project("test_project", 500, 500);
    // api.set_active_project(project_uid);
    // let layer_uid = api.create_layer("layer 1", 500, 500);
    // api.set_active_layer(layer_uid);

    // // draw a rectangle near the middle
    // api.set_primary_colour(255, 100, 100, 255);
    // api.select_rect(100, 100, 100, 100);
    // api.fill_selection();

    // // draw a second rectangle in the bottom right corner
    // api.set_primary_colour(1, 2, 3, 4);
    // api.select_rect(400, 400, 100, 100);
    // api.fill_selection();

    // // top left pixel is empty
    // assert_eq!(api.pick_colour(0, 0), [0, 0, 0, 0]);

    // // the pixel at (100, 100) is the first colour
    // assert_eq!(api.pick_colour(100, 100), [255, 100, 100, 255]);

    // // the pixel in the bottom right corner is the second colour
    // assert_eq!(api.pick_colour(450, 450), [1, 2, 3, 4]);
}

#[test]
fn test_save_and_open_project() {
    // let mut test_path = env::temp_dir();
    // test_path.push("test_project.json");

    // let app = &mut App::new();
    // let p = app.new_project();
    // p.resize_canvas(10, 10);
    // let l1 = p.new_layer();
    // l1.set_name("layer 1");
    // p.save_project(test_path.to_str().unwrap()).unwrap();

    // let p_uid = p.uid;
    // app.close_project(&p_uid);

    // let p2 = app.open_project(test_path.to_str().unwrap());

    // assert_eq!(p_uid, p2.uid);
}

#[test]
fn test_history() {
    // let mut history = history::History::new();
    // let mut layer = Layer::new(1, 1);
    let project = Rc::new(RefCell::new(Project::new("Untitled", 20, 20)));
    let mut history = History::new();

    history.append(Box::new(SetName::new(project.clone(), "A new name")));
    history.execute();

    assert_eq!(project.borrow().name, "A new name");

    history.append(Box::new(ResizeCanvas::new(project.clone(), 10, 10)));
    history.execute();

    assert_eq!(project.borrow().width, 10);
}
