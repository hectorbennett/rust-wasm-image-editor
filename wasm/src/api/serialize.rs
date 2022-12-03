use std::collections::HashMap;

use serde::Serialize;
use wasm_bindgen::JsValue;

use crate::app::{layer::Layer, project::Project, App};

#[derive(Serialize)]
pub struct ApiSerializer {}

impl ApiSerializer {
    pub fn to_json(app: &App) -> JsValue {
        let data = ApiSerializerSchema::from_app(app);
        return serde_wasm_bindgen::to_value(&data).unwrap();
    }
}

#[derive(Serialize, Debug)]
struct ApiSerializerSchema {
    active_project_uid: Option<String>,
    projects: HashMap<String, ProjectSerializer>,
}

impl ApiSerializerSchema {
    pub fn from_app(app: &App) -> ApiSerializerSchema {
        let mut projects: HashMap<String, ProjectSerializer> = HashMap::new();
        app.projects.iter().for_each(|(uid, p)| {
            let s = ProjectSerializer::from_project(p);
            projects.insert(uid.to_string(), s);
        });

        let active_project_uid: Option<String> = match app.active_project_uid {
            None => None,
            Some(uid) => Some(uid.to_string()),
        };

        return ApiSerializerSchema {
            projects,
            active_project_uid,
        };
    }
}

#[derive(Serialize, Debug)]
struct ProjectSerializer {
    uid: String,
    name: String,
    width: u16,
    height: u16,
    image_hash: String,
    layers: HashMap<String, LayerSerializer>,
}

impl ProjectSerializer {
    pub fn from_project(project: &Project) -> ProjectSerializer {
        let mut layers: HashMap<String, LayerSerializer> = HashMap::new();
        project.layers.iter().for_each(|(uid, l)| {
            let s = LayerSerializer::from_layer(l);
            layers.insert(uid.to_string(), s);
        });

        return ProjectSerializer {
            uid: project.uid.to_string(),
            name: project.name.clone(),
            width: project.width.clone(),
            height: project.height.clone(),
            image_hash: project.get_image_hash().to_string(),
            layers,
        };
    }
}

#[derive(Serialize, Debug)]
struct LayerSerializer {
    uid: String,
    name: String,
    width: u16,
    height: u16,
    visible: bool,
    locked: bool,
    thumbnail_hash: String,
}

impl LayerSerializer {
    pub fn from_layer(layer: &Layer) -> LayerSerializer {
        return LayerSerializer {
            uid: layer.uid.to_string(),
            name: layer.name.clone(),
            width: layer.width.clone(),
            height: layer.height.clone(),
            visible: layer.visible.clone(),
            locked: layer.locked.clone(),
            thumbnail_hash: layer.get_thumbnail_hash().to_string(),
        };
    }
}
