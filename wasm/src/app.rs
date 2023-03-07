pub mod colour;
pub mod layer;
pub mod project;

use rand::Rng;
use std::collections::HashMap;

use self::project::Project;

pub fn generate_uid() -> u64 {
    let mut rng = rand::thread_rng();
    rng.gen()
}

pub struct App {
    pub projects: HashMap<u64, Project>,
    pub active_project_uid: Option<u64>,
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
        }
    }

    pub fn new_project(&mut self) -> &mut Project {
        let project: Project = Project::new();
        let uid: u64 = project.uid;
        self.projects.insert(uid, project);
        self.set_active_project(Some(uid));
        return self.projects.get_mut(&uid).unwrap();
    }

    pub fn set_active_project(&mut self, uid: Option<u64>) {
        self.active_project_uid = uid;
    }

    pub fn get_active_project(&mut self) -> Option<&mut Project> {
        self.projects.get_mut(&self.active_project_uid.unwrap())
    }
}
