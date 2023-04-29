pub mod buffer;
pub mod colour;
pub mod commands;
pub mod history;
pub mod layer;
pub mod project;
pub mod project_controller;
pub mod selection;
pub mod timer;
pub mod utils;
pub mod workspace;

use self::history::History;
use self::{colour::Colour, project::Project, project_controller::ProjectController};

pub struct App {
    pub projects: Vec<ProjectController>,
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
            projects: vec![],
            active_project_uid: None,
            primary_colour: Colour::BLACK,
        }
    }

    pub fn new_project(&mut self) -> &ProjectController {
        /* Get a new project name 'Untitled n' */
        let mut n: u8 = 1;
        for project_controller in self.projects.iter() {
            let project_name = project_controller.project.borrow().name.clone();
            if project_name.starts_with("Untitled") {
                n += 1;
            }
        }
        let name: String = format!("Untitled {n}");
        let project: Project = Project::new(&name, 512, 512);
        self.init_project(project)
    }

    pub fn init_project(&mut self, project: Project) -> &ProjectController {
        let uid: u64 = project.uid;
        let controller = ProjectController::new(project, History::new());
        // self.projects.insert(uid, controller);
        self.projects.push(controller);
        self.set_active_project(Some(uid));
        self.get_project_controller(uid).unwrap()
    }

    pub fn get_project_controller(&self, uid: u64) -> Option<&ProjectController> {
        return self.projects.iter().find(|p| p.project.borrow().uid == uid);
    }

    pub fn get_project_controller_mut(&mut self, uid: u64) -> Option<&mut ProjectController> {
        return self
            .projects
            .iter_mut()
            .find(|p| p.project.borrow().uid == uid);
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

    pub fn close_project(&mut self, uid: u64) {
        // self.projects.remove(&uid);
        // self.projects.
        self.projects.retain(|p| p.project.borrow().uid != uid);
        match self.projects.first() {
            Some(project) => self.active_project_uid = Some(project.project.borrow().uid),
            None => self.active_project_uid = None,
        }
    }

    pub fn set_active_project(&mut self, uid: Option<u64>) {
        self.active_project_uid = uid;
    }

    pub fn get_active_project_controller(&self) -> Option<&ProjectController> {
        match self.active_project_uid {
            None => None,
            Some(uid) => self.get_project_controller(uid),
        }
    }

    pub fn get_active_project_controller_mut(&mut self) -> Option<&mut ProjectController> {
        match self.active_project_uid {
            None => None,
            Some(uid) => self.get_project_controller_mut(uid),
        }
    }
}
