pub mod colour;
pub mod commands;
pub mod history;
pub mod layer;
pub mod pixel_buffer;
pub mod project;
pub mod project_controller;
pub mod selection;
pub mod timer;
pub mod utils;
pub mod workspace;

use std::collections::HashMap;

use self::history::History;
use self::{colour::Colour, project::Project, project_controller::ProjectController};

pub struct App {
    pub projects: HashMap<u64, ProjectController>,
    pub active_project_uid: Option<u64>,
    pub primary_colour: Colour,
}

impl Default for App {
    fn default() -> Self {
        Self::new()
    }
}

impl App {
    pub fn new() -> App {
        App {
            projects: HashMap::new(),
            active_project_uid: None,
            primary_colour: Colour::BLACK,
        }
    }

    pub fn new_project(&mut self) -> &ProjectController {
        /* Get a new project name 'Untitled n' */
        let mut n: u8 = 1;
        for project_controller in self.projects.values() {
            let project_name = project_controller.project.borrow().name.clone();
            if project_name.starts_with("Untitled") {
                n += 1;
            }
        }
        let name: String = format!("Untitled {}", n);
        let project: Project = Project::new(&name, 512, 512);
        self.init_project(project)
    }

    pub fn init_project(&mut self, project: Project) -> &ProjectController {
        let uid: u64 = project.uid;
        let controller = ProjectController::new(project, History::new());
        self.projects.insert(uid, controller);
        self.set_active_project(Some(uid));
        self.projects.get(&uid).unwrap()
    }

    pub fn open_project(&mut self, path: &str) -> &ProjectController {
        let p = std::fs::read(path).unwrap();
        self.open_project_from_postcard(p)
    }

    pub fn open_project_from_postcard(&mut self, p: Vec<u8>) -> &ProjectController {
        let project = Project::from_postcard(p);
        self.init_project(project)
    }

    pub fn open_project_from_json(&mut self, json: &str) -> &ProjectController {
        let project = Project::from_json(json);
        self.init_project(project)
    }

    pub fn close_project(&mut self, &uid: &u64) {
        self.projects.remove(&uid);
    }

    pub fn set_active_project(&mut self, uid: Option<u64>) {
        self.active_project_uid = uid;
    }

    pub fn get_active_project_controller(&mut self) -> Option<&mut ProjectController> {
        match self.projects.get_mut(&self.active_project_uid.unwrap()) {
            None => None,
            Some(controller) => Some(controller),
        }
    }

    // pub fn get_active_project(&mut self) -> Option<Rc<RefCell<Project>>> {
    //     /* TODO: return None if there is no active_project_uid */
    //     Some(
    //         self.projects
    //             .get_mut(&self.active_project_uid.unwrap())
    //             .unwrap()
    //             .project,
    //     )
    // }
}
