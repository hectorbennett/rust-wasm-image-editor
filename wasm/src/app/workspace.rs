use std::{cell::RefCell, cmp, rc::Rc};

use super::{buffer::rgba_buffer::RgbaBuffer, project::Project};

const YELLOW: [u8; 4] = [255, 255, 0, 255];
const BLACK: [u8; 4] = [0, 0, 0, 255];

pub struct Workspace {
    project: Rc<RefCell<Project>>,
    pub width: u32,
    pub height: u32,
    pub zoom: f32,
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
        self.zoom = cmp::max(self.zoom as i32 + zoom_delta, 1) as f32;
        self.x = (workspace_x as f32
            - ((workspace_x as f32 - self.x as f32) / previous_zoom) * self.zoom)
            as i32;
        self.y = (workspace_y as f32
            - ((workspace_y as f32 - self.y as f32) / previous_zoom) * self.zoom)
            as i32;
    }

    pub fn workspace_to_project_coords(&self, coords: [i32; 2]) -> [i32; 2] {
        [
            100 * (coords[0] - self.x) / self.zoom as i32,
            100 * (coords[1] - self.y) / self.zoom as i32,
        ]
    }

    pub fn project_to_workspace_coords(&self, coords: [i32; 2]) -> [i32; 2] {
        [
            (coords[0] as f32 * (self.zoom / 100.0) + self.x as f32) as i32,
            (coords[1] as f32 * (self.zoom / 100.0) + self.y as f32) as i32,
        ]
    }

    pub fn set_zoom(&mut self, zoom: u32) {
        self.zoom = zoom as f32;
    }

    pub fn center_canvas(&mut self) {
        self.x = (self.width as i32 - self.project.borrow().width as i32) / 2;
        self.y = (self.height as i32 - self.project.borrow().height as i32) / 2;
    }

    pub fn to_vec(&self) -> Vec<u8> {
        let mut pixel_buffer = RgbaBuffer::new(self.width, self.height);

        let project = self.project.borrow();

        let project_width = project.width as i32;
        let project_height = project.height as i32;

        let [mut p_l, mut p_t] = self.project_to_workspace_coords([0, 0]);
        let [mut p_r, mut p_b] = self.project_to_workspace_coords([project_width, project_height]);

        if p_r < 0 || p_b < 0 || p_l >= self.width as i32 || p_t >= self.height as i32 {
            return pixel_buffer.as_vec().to_vec();
        }

        p_l = cmp::max(p_l, 0);
        p_t = cmp::max(p_t, 0);
        p_r = cmp::min(p_r, (self.width - 1) as i32);
        p_b = cmp::min(p_b, (self.height - 1) as i32);

        // render project pixels
        (p_l..p_r).for_each(|i| {
            (p_t..p_b).for_each(|j| {
                let [p_x, p_y] = self.workspace_to_project_coords([i, j]);

                let p = project.get_pixel(p_x as u32, p_y as u32);
                pixel_buffer.set_pixel(i as u32, j as u32, p);
            });
        });

        // black project border
        (p_l..p_r).for_each(|i| {
            pixel_buffer.set_pixel(i as u32, p_t as u32, BLACK);
            pixel_buffer.set_pixel(i as u32, p_b as u32, BLACK);
        });
        (p_t..p_b).for_each(|j| {
            pixel_buffer.set_pixel(p_l as u32, j as u32, BLACK);
            pixel_buffer.set_pixel(p_r as u32, j as u32, BLACK);
        });

        // Render a yellow Active layer border
        if let Some(layer) = project.get_active_layer() {
            let [mut l_l, mut l_t] = self.project_to_workspace_coords([layer.left, layer.top]);
            let [mut l_r, mut l_b] = self.project_to_workspace_coords([
                layer.left + layer.width as i32,
                layer.top + layer.height as i32,
            ]);
            l_l = cmp::max(l_l, 0);
            l_t = cmp::max(l_t, 0);
            l_r = cmp::min(l_r, (self.width - 1) as i32);
            l_b = cmp::min(l_b, (self.height - 1) as i32);
            (l_l..l_r).for_each(|i| {
                if i >= 0 && i < self.width as i32 {
                    pixel_buffer.set_pixel(i as u32, l_t as u32, YELLOW);
                    pixel_buffer.set_pixel(i as u32, l_b as u32, YELLOW);
                }
            });
            (l_t..l_b).for_each(|j| {
                if j >= 0 && j < self.height as i32 {
                    pixel_buffer.set_pixel(l_l as u32, j as u32, YELLOW);
                    pixel_buffer.set_pixel(l_r as u32, j as u32, YELLOW);
                }
            });
        }

        // render selection
        for [i, j] in project.selection.border_coordinates() {
            let [s_x, s_y] = self.project_to_workspace_coords([*i, *j]);
            if s_x >= 0 && s_y >= 0 && s_x < self.width as i32 && s_y < self.height as i32 {
                pixel_buffer.set_pixel(
                    s_x as u32,
                    s_y as u32,
                    get_selection_pixel(s_x as u32, s_y as u32),
                );
            }
        }

        pixel_buffer.as_vec().to_vec()
    }
}

fn get_selection_pixel(x: u32, y: u32) -> [u8; 4] {
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

        // let v = [
        //     [YELLOW, YELLOW, YELLOW],
        //     [YELLOW, GREY_1, YELLOW],
        //     [YELLOW, YELLOW, YELLOW],
        // ];

        // let flattened = v.into_iter().flatten().flatten().collect::<Vec<u8>>();
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

    #[test]
    fn test_scroll_too_far_left() {
        let project = Rc::new(RefCell::new(Project::demo()));
        let mut workspace = Workspace::new(Rc::clone(&project));
        workspace.resize(2, 2);
        workspace.set_position(-2, -2);
        workspace.to_vec();
        // assert_eq!()
        // assert_eq!(workspace.to_vec(), vec![0]);
    }
}
