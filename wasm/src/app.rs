pub mod colour;
pub mod layer;
pub mod project;
pub mod selection;
pub mod utils;

use rand::Rng;
use std::collections::HashMap;

use self::{colour::Colour, project::Project};

pub fn generate_uid() -> u64 {
    let mut rng = rand::thread_rng();
    return rng.gen();
}

pub struct App {
    pub projects: HashMap<u64, Project>,
    pub active_project_uid: Option<u64>,
    pub primary_colour: Colour,
}

impl App {
    pub fn new() -> App {
        return App {
            projects: HashMap::new(),
            active_project_uid: None,
            primary_colour: Colour::BLACK,
        };
    }

    pub fn new_project(&mut self) -> &mut Project {
        let project: Project = Project::new();
        let uid: u64 = project.uid.clone();
        self.projects.insert(uid.clone(), project);
        self.set_active_project(Some(uid.clone()));
        return self.projects.get_mut(&uid).unwrap();
    }

    pub fn set_active_project(&mut self, uid: Option<u64>) {
        self.active_project_uid = uid.clone();
    }

    pub fn get_active_project(&mut self) -> Option<&mut Project> {
        return self.projects.get_mut(&self.active_project_uid.unwrap());
    }
}
