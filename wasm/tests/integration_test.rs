use wasm::api::Api;
use wasm_bindgen_test::*;

#[test]
fn it_adds_two() {
    assert_eq!(4, 2 + 2);
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
    // let project = Rc::new(RefCell::new(Project::new("Untitled", 20, 20)));
    // let mut history = History::new();

    // history.append(Box::new(SetName::new(project.clone(), "A new name")));

    // assert_eq!(project.borrow().name, "A new name");

    // history.append(Box::new(ResizeCanvas::new(project.clone(), 10, 10)));

    // assert_eq!(project.borrow().width, 10);
}

#[test]
fn test_create_project() {
    let mut api = Api::init();
    api.create_project();
}

#[wasm_bindgen_test]
fn test_move_active_layer() {
    let mut api = Api::init();
    api.create_project();
    api.move_active_layer(-10, -10);
}
