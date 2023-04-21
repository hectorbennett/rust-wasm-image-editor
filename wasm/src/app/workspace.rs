use std::{cell::RefCell, cmp, rc::Rc};

// use super::pixel_buffer;
use super::pixel_buffer::Pixel;
use super::pixel_buffer::PixelBuffer;
use super::project::Project;
use super::utils::blend_pixels;
// u 0se super::utils::coord_is_on_outline_of_rect;

// const ALPHA: Pixel = [0, 0, 0, 0];
const YELLOW: Pixel = [255, 255, 0, 255];
const GREY_1: Pixel = [135, 135, 135, 255];
const GREY_2: Pixel = [90, 90, 90, 255];
const BLACK: Pixel = [0, 0, 0, 255];

pub struct Workspace {
    project: Rc<RefCell<Project>>,
    pub width: u32,
    pub height: u32,
    pub zoom: f64,
    pub x: i32,
    pub y: i32,
}

impl Workspace {
    pub fn new(project: Rc<RefCell<Project>>) -> Workspace {
        Workspace {
            project,
            width: 0,
            height: 0,
            zoom: 100.0,
            x: 0,
            y: 0,
        }
    }

    pub fn resize(&mut self, width: u32, height: u32) {
        self.width = width;
        self.height = height;
    }

    pub fn set_position(&mut self, x: i32, y: i32) {
        self.x = x;
        self.y = y;
    }

    pub fn scroll(&mut self, delta_x: i32, delta_y: i32) {
        self.x += delta_x;
        self.y += delta_y;
    }

    pub fn zoom(&mut self, zoom_delta: i32, workspace_x: u32, workspace_y: u32) {
        /* Zoom in, around the mouse cursor */
        let previous_zoom = self.zoom;
        self.zoom = cmp::max(self.zoom as i32 + zoom_delta, 1) as f64;
        self.x = (workspace_x as f64
            - ((workspace_x as f64 - self.x as f64) / previous_zoom) * self.zoom)
            as i32;
        self.y = (workspace_y as f64
            - ((workspace_y as f64 - self.y as f64) / previous_zoom) * self.zoom)
            as i32;
    }

    pub fn workspace_to_project_coords(&self, coords: [i32; 2]) -> [i32; 2] {
        [
            ((coords[0] as f64 - self.x as f64) / (self.zoom / 100.0)) as i32,
            ((coords[1] as f64 - self.y as f64) / (self.zoom / 100.0)) as i32,
        ]
    }

    pub fn project_to_workspace_coords(&self, coords: [i32; 2]) -> [i32; 2] {
        [
            ((self.x as f64 + coords[0] as f64) * (self.zoom / 100.0)) as i32,
            ((self.y as f64 + coords[1] as f64) * (self.zoom / 100.0)) as i32,
        ]
    }

    pub fn set_zoom(&mut self, zoom: u32) {
        self.zoom = zoom.into();
    }

    pub fn center_canvas(&mut self) {
        self.x = (self.width as i32 - self.project.borrow().width as i32) / 2;
        self.y = (self.height as i32 - self.project.borrow().height as i32) / 2;
    }

    pub fn to_vec(&self) -> Vec<u8> {
        let mut pixel_buffer = PixelBuffer::new(self.width, self.height);

        let project_width = self.project.borrow().width as i32;
        let project_height = self.project.borrow().height as i32;

        let [p_l, p_t] = self.project_to_workspace_coords([0, 0]);
        let [p_r, p_b] = self.project_to_workspace_coords([project_width, project_height]);

        // render project pixels
        (p_l..p_r).for_each(|i| {
            (p_t..p_b).for_each(|j| {
                let [p_x, p_y] = self.workspace_to_project_coords([i as i32, j as i32]);

                if let Some(p) = self.project.borrow().get_pixel(p_x as u32, p_y as u32) {
                    if p[3] == 244 {
                        pixel_buffer.set(i as u32, j as u32, p);
                    } else {
                        let c = get_background_pixel(p_x as u32, p_y as u32);
                        pixel_buffer.set(i as u32, j as u32, blend_pixels(c, p))
                    }
                }
            });
        });

        // black project border
        (p_l..p_r).for_each(|i| {
            pixel_buffer.set(i as u32, p_t as u32, BLACK);
            pixel_buffer.set(i as u32, p_b as u32, BLACK);
        });
        (p_t..p_b).for_each(|j| {
            pixel_buffer.set(p_l as u32, j as u32, BLACK);
            pixel_buffer.set(p_r as u32, j as u32, BLACK);
        });

        // Render a yellow Active layer border
        if let Some(layer) = self.project.borrow().get_active_layer() {
            let [l_l, l_t] = self.project_to_workspace_coords([layer.left, layer.top]);
            let [l_r, l_b] = self.project_to_workspace_coords([
                layer.left + layer.width as i32,
                layer.top + layer.height as i32,
            ]);
            (l_l..l_r).for_each(|i| {
                if i >= 0 {
                    pixel_buffer.set(i as u32, l_t as u32, YELLOW);
                    pixel_buffer.set(i as u32, l_b as u32, YELLOW);
                }
            });
            (l_t..l_b).for_each(|j| {
                if j >= 0 {
                    pixel_buffer.set(l_l as u32, j as u32, YELLOW);
                    pixel_buffer.set(l_r as u32, j as u32, YELLOW);
                }
            });
        }

        // render selection
        for [i, j] in self.project.borrow().selection.border_coordinates() {
            let [s_x, s_y] = self.project_to_workspace_coords([*i, *j]);
            pixel_buffer.set(
                s_x as u32,
                s_y as u32,
                get_selection_pixel(s_x as u32, s_y as u32),
            );
        }

        pixel_buffer.as_vec()
    }
}

fn get_background_pixel(x: u32, y: u32) -> Pixel {
    const SQUARE_SIZE: u32 = 10;
    if ((x / SQUARE_SIZE) + (y / SQUARE_SIZE)).rem_euclid(2) == 0 {
        GREY_1
    } else {
        GREY_2
    }
}

fn get_selection_pixel(x: u32, y: u32) -> Pixel {
    // todo: animate based on timestamp
    const SQUARE_SIZE: u32 = 5;
    if ((x / SQUARE_SIZE) + (y / SQUARE_SIZE)).rem_euclid(2) == 0 {
        [255, 255, 255, 210]
    } else {
        [0, 0, 0, 210]
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::app::Colour;

    #[test]
    fn center_canvas() {
        // Create a 7x7 workspace containing a 3x5 image
        // - - - - - - -
        // - - x x x - -
        // - - x x x - -
        // - - x x x - -
        // - - x x x - -
        // - - x x x - -
        // - - - - - - -
        let project = Rc::new(RefCell::new(Project::new("Untitled", 3, 5)));
        let mut workspace = Workspace::new(Rc::clone(&project));
        workspace.resize(7, 7);
        workspace.center_canvas();
        assert_eq!(workspace.x, 2);
        assert_eq!(workspace.y, 1);

        // set the workspace to be an even numbered width so exact centering is impossible.
        // - - - - - -
        // - x x x - -
        // - x x x - -
        // - x x x - -
        // - x x x - -
        // - x x x - -
        // - - - - - -

        workspace.resize(6, 7);
        workspace.center_canvas();
        assert_eq!(workspace.x, 1);
        assert_eq!(workspace.y, 1);

        // resize so that the canvas is too small for the image
        // x x x
        // x x x
        // x - x
        // x x x
        // x x x
        workspace.resize(1, 1);
        workspace.center_canvas();
        assert_eq!(workspace.x, -1);
        assert_eq!(workspace.y, -2);
    }

    #[test]
    fn get_pixel() {
        // Create a new 4x4 project with a white background
        let mut p = Project::new("Untitled", 2, 2);
        p.selection.select_all();
        let selection = p.selection.clone();
        let colour: Colour = Colour::WHITE;
        p.get_active_layer_mut()
            .unwrap()
            .fill_selection(&selection, &colour);
        let project = Rc::new(RefCell::new(p));

        // put it in a 6x6 workspace and center it
        let mut workspace = Workspace::new(Rc::clone(&project));
        workspace.resize(6, 6);
        workspace.center_canvas();

        // . . . . . .
        // . * * * * .
        // . * x x * .
        // . * x x * .
        // . * * * * .
        // . . . . . .

        // assert that pixels on the edge of the workspace are transparent
        // assert_eq!(workspace.get_pixel(0, 0).unwrap(), [0, 0, 0, 0]);
        // assert_eq!(workspace.get_pixel(5, 3).unwrap(), [0, 0, 0, 0]);

        // assert that pixels on the edge of the active layer are yellow
        // assert_eq!(workspace.get_pixel(1, 1).unwrap(), [255, 255, 0, 255]);
        // assert_eq!(workspace.get_pixel(4, 4).unwrap(), [255, 255, 0, 255]);

        // assert that a pixel within the project is white
        // assert_eq!(workspace.get_pixel(2, 2).unwrap(), [255, 255, 255, 255]);
        // assert_eq!(workspace.get_pixel(3, 3).unwrap(), [255, 255, 255, 255]);
    }

    #[test]
    fn to_vec() {
        let project = Rc::new(RefCell::new(Project::new("Untitled", 1, 1)));
        let mut workspace = Workspace::new(Rc::clone(&project));
        workspace.resize(3, 3);
        workspace.center_canvas();

        let v = [
            [YELLOW, YELLOW, YELLOW],
            [YELLOW, GREY_1, YELLOW],
            [YELLOW, YELLOW, YELLOW],
        ];

        let flattened = v.into_iter().flatten().flatten().collect::<Vec<u8>>();
        // assert_eq!(workspace.to_vec(), flattened);
    }

    #[test]
    fn zoom() {
        /* create a 2x2 project in a 4x4 workspace and zoom it to 200% */
        let project = Rc::new(RefCell::new(Project::new("Untitled", 1, 1)));
        let mut workspace = Workspace::new(Rc::clone(&project));
        workspace.resize(4, 4);
        workspace.zoom(200, 0, 0);
        workspace.center_canvas();

        // let v = [
        //     [YELLOW, YELLOW, YELLOW, YELLOW],
        //     [YELLOW, GREY_1, GREY_1, YELLOW],
        //     [YELLOW, GREY_1, GREY_1, YELLOW],
        //     [YELLOW, YELLOW, YELLOW, YELLOW],
        // ];

        // let flattened = v.into_iter().flatten().flatten().collect::<Vec<u8>>();
        // assert_eq!(workspace.to_vec(), flattened);
    }
}
