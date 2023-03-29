pub mod colour;
pub mod layer;
pub mod project;
pub mod selection;
pub mod timer;
pub mod utils;

use std::collections::HashMap;

use self::{colour::Colour, project::Project};

pub struct App {
    pub projects: HashMap<u64, Project>,
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

    pub fn new_project(&mut self) -> &mut Project {
        let project: Project = Project::new();
        let uid: u64 = project.uid;
        self.projects.insert(uid, project);
        self.set_active_project(Some(uid));
        return self.projects.get_mut(&uid).unwrap();
    }

    pub fn open_project(&mut self, path: &str) -> &mut Project {
        let json = std::fs::read_to_string(path).unwrap();
        let project = Project::from_json(&json);
        let uid = project.uid;
        self.projects.insert(uid, project);
        self.set_active_project(Some(uid));
        return self.projects.get_mut(&uid).unwrap();
    }

    pub fn close_project(&mut self, &uid: &u64) {
        self.projects.remove(&uid);
    }

    pub fn set_active_project(&mut self, uid: Option<u64>) {
        self.active_project_uid = uid;
    }

    pub fn get_active_project(&mut self) -> Option<&mut Project> {
        self.projects.get_mut(&self.active_project_uid.unwrap())
    }
}
