use std::collections::HashMap;

use crate::app::{history::History, layer::Layer, project_controller::ProjectController, App};
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
            let s = ProjectSerializer::from_project_controller(p);
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
    layers: Vec<LayerSerializer>,
    active_layer_uid: Option<String>,
    history: HistorySerializer,
}

impl ProjectSerializer {
    pub fn from_project_controller(project_controller: &ProjectController) -> ProjectSerializer {
        let project = project_controller.project.borrow();

        let mut layers: Vec<LayerSerializer> = vec![];
        project.layers.iter().for_each(|l| {
            let s = LayerSerializer::from_layer(l);
            layers.push(s);
        });

        let active_layer_uid: Option<String> = project.active_layer_uid.map(|uid| uid.to_string());

        let history = HistorySerializer::from_history(&project_controller.history);

        ProjectSerializer {
            uid: project.uid.to_string(),
            name: project.name.clone(),
            width: project.width,
            height: project.height,
            layers,
            active_layer_uid,
            history,
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

#[derive(Serialize, Debug, Tsify)]
struct HistorySerializer {
    revision: u32,
    history: Vec<CommandSerializer>,
}

impl HistorySerializer {
    pub fn from_history(history: &History) -> HistorySerializer {
        let mut commands: Vec<CommandSerializer> = vec![];
        history.history.iter().for_each(|c| {
            commands.push(CommandSerializer { name: c.name() });
        });

        HistorySerializer {
            revision: history.revision as u32,
            history: commands,
        }
    }
}

#[derive(Serialize, Debug, Tsify)]
struct CommandSerializer {
    name: String,
}
