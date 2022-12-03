pub mod colour;
pub mod layer;
pub mod project;

use rand::Rng;
use std::collections::HashMap;

use self::project::Project;

pub fn generate_uid() -> u64 {
    let mut rng = rand::thread_rng();
    return rng.gen();
}

pub struct App {
    pub projects: HashMap<u64, Project>,
    active_project_uid: u64,
}

impl App {
    pub fn new() -> App {
        return App {
            projects: HashMap::new(),
            active_project_uid: 0,
        };
    }

    pub fn new_project(&mut self) -> &mut Project {
        let project: Project = Project::new();
        let uid: u64 = project.uid.clone();
        self.projects.insert(uid.clone(), project);
        self.set_active_project(uid.clone());
        return self.projects.get_mut(&uid).unwrap();
    }

    pub fn set_active_project(&mut self, uid: u64) {
        self.active_project_uid = uid;
    }

    pub fn get_active_project(&mut self) -> Option<&mut Project> {
        return self.projects.get_mut(&self.active_project_uid);
    }
}

// fn test_create_project(app: &mut App) {
//     let project = app.new_project();
//     project.resize_canvas(500, 500);
//     project.set_name("A test project");
// }

// fn test_create_layer_1(app: &mut App) {
//     let project = app.get_active_project().unwrap();
//     let layer_1: &mut Layer = project.new_layer();
//     layer_1.set_name("A test layer");
//     layer_1.resize(500, 500);
//     let red = Colour::from_rgba(255, 0, 0, 100);
//     layer_1.fill_rect(red, 100, 100, 150, 150);
// }

// fn test_create_layer_2(app: &mut App) {
//     let project = app.get_active_project().unwrap();
//     let layer_2: &mut Layer = project.new_layer();
//     layer_2.set_name("A second layer");
//     layer_2.resize(500, 500);
//     let blue = Colour::from_rgba(0, 0, 100, 100);
//     layer_2.fill_rect(blue, 180, 150, 200, 200);
// }

// fn test_create_layer_3(app: &mut App) {
//     let project = app.get_active_project().unwrap();
//     let layer_3: &mut Layer = project.new_layer();
//     layer_3.set_name("A third layer");
//     layer_3.resize(500, 500);
//     let green = Colour::from_rgba(0, 255, 0, 100);
//     layer_3.fill_rect(green, 220, 50, 180, 150);
// }

// fn toggle_top_layer_visibility(app: &mut App) {
//     let project = app.get_active_project().unwrap();
//     let layer: &mut Layer = project.layers.last_mut().unwrap().1;
//     layer.set_visible(false);
// }

// fn test_create_image(app: &mut App) {
//     let project = app.get_active_project().unwrap();
//     project.render_image();
// }

// fn main() {
//     println!("Hello, world!");
//     let app: &mut App = &mut App::new();
//     test_create_project(app);
//     test_create_layer_1(app);
//     test_create_layer_2(app);
//     test_create_layer_3(app);
//     toggle_top_layer_visibility(app);
//     test_create_image(app);
// }
