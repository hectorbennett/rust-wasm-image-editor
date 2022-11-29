use image::{imageops, ImageBuffer, Pixel, RgbaImage};
use indexmap::IndexMap;
use rand::Rng;
use std::collections::HashMap;

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

pub struct Project {
    pub uid: u64,
    pub name: String,
    pub width: u16,
    pub height: u16,
    pub layers: IndexMap<u64, Layer>,
}

impl Project {
    pub fn new() -> Project {
        return Project {
            uid: generate_uid(),
            name: "".into(),
            width: 20,
            height: 20,
            layers: IndexMap::new(),
        };
    }

    pub fn set_name(&mut self, name: &str) -> () {
        self.name = name.into();
    }

    pub fn resize_canvas(&mut self, width: u16, height: u16) -> () {
        self.width = width;
        self.height = height;
    }

    pub fn new_layer(&mut self) -> &mut Layer {
        let layer: Layer = Layer::new();
        let uid: u64 = layer.uid.clone();
        self.layers.insert(uid.clone(), layer);
        return self.get_layer(uid);
    }

    pub fn get_layer(&mut self, uid: u64) -> &mut Layer {
        return self.layers.get_mut(&uid).unwrap();
    }

    pub fn get_image(&self) -> RgbaImage {
        return ImageBuffer::from_fn(self.width as u32, self.height as u32, |x, y| {
            return image::Rgba(self.get_compiled_pixel(x as u16, y as u16));
        });
    }

    fn render_image(&self) -> () {
        let img = self.get_image();
        img.save("test.png").unwrap();
    }

    fn get_compiled_pixel(&self, x: u16, y: u16) -> [u8; 4] {
        let mut output = [0, 0, 0, 0];
        for (_uid, layer) in self.layers.iter() {
            let pixel = layer.get_pixel_from_canvas_coordinates(x, y);
            output = blend_pixels(output, pixel);
        }
        return output;
    }
}

pub fn blend_pixels(pixel_bg: [u8; 4], pixel_fg: [u8; 4]) -> [u8; 4] {
    let red_bg: f32 = pixel_bg[0] as f32 / 255.0;
    let green_bg: f32 = pixel_bg[1] as f32 / 255.0;
    let blue_bg: f32 = pixel_bg[2] as f32 / 255.0;
    let alpha_bg: f32 = pixel_bg[3] as f32 / 255.0;

    let red_fg: f32 = pixel_fg[0] as f32 / 255.0;
    let green_fg: f32 = pixel_fg[1] as f32 / 255.0;
    let blue_fg: f32 = pixel_fg[2] as f32 / 255.0;
    let alpha_fg: f32 = pixel_fg[3] as f32 / 255.0;

    let alpha_final = alpha_bg + alpha_fg - alpha_bg * alpha_fg;

    let red_bg_a = red_bg * alpha_bg;
    let red_fg_a: f32 = red_fg * alpha_fg;
    let red_final_a = red_fg_a + red_bg_a * (1.0 - alpha_fg);
    let red_final = red_final_a / alpha_final;

    let green_bg_a = green_bg * alpha_bg;
    let green_fg_a: f32 = green_fg * alpha_fg;
    let green_final_a = green_fg_a + green_bg_a * (1.0 - alpha_fg);
    let green_final = green_final_a / alpha_final;

    let blue_bg_a = blue_bg * alpha_bg;
    let blue_fg_a: f32 = blue_fg * alpha_fg;
    let blue_final_a = blue_fg_a + blue_bg_a * (1.0 - alpha_fg);
    let blue_final = blue_final_a / alpha_final;

    return [
        (red_final * 255.0) as u8,
        (green_final * 255.0) as u8,
        (blue_final * 255.0) as u8,
        (alpha_final * 255.0) as u8,
    ];
}

pub struct Layer {
    pub uid: u64,
    pub name: String,
    pub width: u16,
    pub height: u16,
    pub visible: bool,
    img: RgbaImage,
}

impl Layer {
    pub fn new() -> Layer {
        return Layer {
            uid: generate_uid(),
            name: "".into(),
            width: 500,
            height: 500,
            visible: true,
            img: ImageBuffer::from_fn(500, 500, |_x, _y| image::Rgba([0, 0, 0, 0])),
        };
    }

    pub fn set_name(&mut self, name: &str) -> () {
        self.name = name.into();
    }

    pub fn resize(&mut self, width: u16, height: u16) -> () {
        self.width = width;
        self.height = height;
        let sub_img = imageops::crop(&mut self.img, 0, 0, width as u32, height as u32);
        self.img = sub_img.to_image();
    }

    pub fn set_visible(&mut self, visible: bool) -> () {
        self.visible = visible;
    }

    pub fn fill_rect(
        &mut self,
        colour: Colour,
        left: u16,
        top: u16,
        width: u16,
        height: u16,
    ) -> () {
        let right = left + width;
        let bottom = top + height;
        (left..=right).for_each(|i: u16| {
            (top..=bottom).for_each(|j: u16| {
                let pixel = image::Rgba(colour.as_rgba());
                self.img.put_pixel(i as u32, j as u32, pixel);
            });
        });
    }

    pub fn get_pixel_from_canvas_coordinates(&self, x: u16, y: u16) -> [u8; 4] {
        let pixel = *self.img.get_pixel(x as u32, y as u32);
        let rgba = pixel.to_rgba();
        return rgba.0;
    }
}

#[derive(Clone, Copy)]
pub struct Colour {
    red: u8,
    green: u8,
    blue: u8,
    alpha: u8,
}

impl Colour {
    pub const ALPHA: Colour = Colour::from_rgba(255, 255, 255, 0);
    pub const WHITE: Colour = Colour::from_rgb(255, 255, 255);

    pub const fn from_rgb(red: u8, green: u8, blue: u8) -> Colour {
        return Colour {
            red,
            green,
            blue,
            alpha: 255,
        };
    }

    pub const fn from_rgba(red: u8, green: u8, blue: u8, alpha: u8) -> Colour {
        return Colour {
            red,
            green,
            blue,
            alpha,
        };
    }

    pub fn as_rgba(&self) -> [u8; 4] {
        return [self.red, self.green, self.blue, self.alpha];
    }

    pub fn as_rgb(&self) -> [u8; 3] {
        return [self.red, self.green, self.blue];
    }

    pub fn set(&mut self, colour: Colour) -> () {
        self.red = colour.red;
        self.green = colour.green;
        self.blue = colour.blue;
        self.alpha = colour.alpha;
    }
}

fn test_create_project(app: &mut App) {
    let project = app.new_project();
    project.resize_canvas(500, 500);
    project.set_name("A test project");
}

fn test_create_layer_1(app: &mut App) {
    let project = app.get_active_project().unwrap();
    let layer_1: &mut Layer = project.new_layer();
    layer_1.set_name("A test layer");
    layer_1.resize(500, 500);
    let red = Colour::from_rgba(255, 0, 0, 100);
    layer_1.fill_rect(red, 100, 100, 150, 150);
}

fn test_create_layer_2(app: &mut App) {
    let project = app.get_active_project().unwrap();
    let layer_2: &mut Layer = project.new_layer();
    layer_2.set_name("A second layer");
    layer_2.resize(500, 500);
    let blue = Colour::from_rgba(0, 0, 100, 100);
    layer_2.fill_rect(blue, 180, 150, 200, 200);
}

fn test_create_layer_3(app: &mut App) {
    let project = app.get_active_project().unwrap();
    let layer_3: &mut Layer = project.new_layer();
    layer_3.set_name("A third layer");
    layer_3.resize(500, 500);
    let green = Colour::from_rgba(0, 255, 0, 100);
    layer_3.fill_rect(green, 220, 50, 180, 150);
}

fn toggle_top_layer_visibility(app: &mut App) {
    let project = app.get_active_project().unwrap();
    let layer: &mut Layer = project.layers.last_mut().unwrap().1;
    layer.set_visible(false);
}

fn test_create_image(app: &mut App) {
    let project = app.get_active_project().unwrap();
    project.render_image();
}

fn main() {
    println!("Hello, world!");
    let app: &mut App = &mut App::new();
    test_create_project(app);
    test_create_layer_1(app);
    test_create_layer_2(app);
    test_create_layer_3(app);
    toggle_top_layer_visibility(app);
    test_create_image(app);
}
