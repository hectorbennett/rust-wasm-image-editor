use std::collections::HashMap;

use crate::app::{layer::Layer, project::Project, App};
use serde::Serialize;
use tsify::Tsify;
use wasm_bindgen::{prelude::wasm_bindgen, JsValue};

#[derive(Serialize)]
pub struct ApiSerializer {}

impl ApiSerializer {
    pub fn to_json(app: &App) -> JsValue {
        let data = ApiSerializerSchema::from_app(app);
        serde_wasm_bindgen::to_value(&data).unwrap()
    }
}

#[derive(Serialize, Debug, Tsify)]
pub struct ApiSerializerSchema {
    active_project_uid: Option<String>,
    projects: HashMap<String, ProjectSerializer>,
    primary_colour: [u8; 4],
}

impl ApiSerializerSchema {
    pub fn from_app(app: &App) -> ApiSerializerSchema {
        let mut projects: HashMap<String, ProjectSerializer> = HashMap::new();
        app.projects.iter().for_each(|(uid, p)| {
            let s = ProjectSerializer::from_project(p);
            projects.insert(uid.to_string(), s);
        });

        let active_project_uid: Option<String> = app.active_project_uid.map(|uid| uid.to_string());
        let primary_colour: [u8; 4] = app.primary_colour.as_rgba();

        ApiSerializerSchema {
            projects,
            active_project_uid,
            primary_colour,
        }
    }
}

#[derive(Serialize, Debug, Tsify)]
struct ProjectSerializer {
    uid: String,
    name: String,
    width: u32,
    height: u32,
    image_hash: String,
    layers: Vec<LayerSerializer>,
    active_layer_uid: Option<String>,
}

impl ProjectSerializer {
    pub fn from_project(project: &Project) -> ProjectSerializer {
        let mut layers: Vec<LayerSerializer> = vec![];
        project.layers.iter().for_each(|l| {
            let s = LayerSerializer::from_layer(l);
            layers.push(s);
        });

        let active_layer_uid: Option<String> = project.active_layer_uid.map(|uid| uid.to_string());

        ProjectSerializer {
            uid: project.uid.to_string(),
            name: project.name.clone(),
            width: project.width,
            height: project.height,
            image_hash: project.get_image_hash().to_string(),
            layers,
            active_layer_uid,
        }
    }
}

#[derive(Serialize, Debug, Tsify)]
struct LayerSerializer {
    uid: String,
    name: String,
    width: u32,
    height: u32,
    visible: bool,
    locked: bool,
    thumbnail_hash: String,
}

impl LayerSerializer {
    pub fn from_layer(layer: &Layer) -> LayerSerializer {
        LayerSerializer {
            uid: layer.uid.to_string(),
            name: layer.name.clone(),
            width: layer.width,
            height: layer.height,
            visible: layer.visible,
            locked: layer.locked,
            thumbnail_hash: layer.get_thumbnail_hash().to_string(),
        }
    }
}
