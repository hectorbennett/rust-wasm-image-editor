use std::collections::HashMap;

use serde::Serialize;
use wasm_bindgen::JsValue;
// use wasm_bindgen_test::console_log;

use crate::app::{App, Layer, Project};

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
    projects: HashMap<String, ProjectSerializer>,
}

impl ApiSerializerSchema {
    pub fn from_app(app: &App) -> ApiSerializerSchema {
        let mut projects: HashMap<String, ProjectSerializer> = HashMap::new();
        app.projects.iter().for_each(|(uid, p)| {
            let s = ProjectSerializer::from_project(p);
            projects.insert(uid.to_string(), s);
        });

        // let mut projects_2: HashMap<u64, ProjectSerializer> = HashMap::new();
        // let p = ProjectSerializer { uid: 10 };
        // projects_2.insert(10, p);
        // // console_log!("{:?}", projects);
        return ApiSerializerSchema { projects };
    }
}

#[derive(Serialize, Debug)]
struct ProjectSerializer {
    uid: String,
    name: String,
    width: u16,
    height: u16,
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
}

impl LayerSerializer {
    pub fn from_layer(layer: &Layer) -> LayerSerializer {
        return LayerSerializer {
            uid: layer.uid.to_string(),
            name: layer.name.clone(),
            width: layer.width.clone(),
            height: layer.height.clone(),
            visible: layer.visible.clone(),
        };
    }
}
