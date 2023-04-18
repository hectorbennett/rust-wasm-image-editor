use std::{cell::RefCell, rc::Rc};

use super::colour::Colour;
use super::pixel_buffer::Pixel;
use super::project::Project;
use super::utils::blend_pixels;

pub struct Workspace {
    project: Rc<RefCell<Project>>,
    pub width: u32,
    pub height: u32,
    pub zoom: u32,
    pub x: i32,
    pub y: i32,
}

impl Workspace {
    pub fn new(project: Rc<RefCell<Project>>) -> Workspace {
        Workspace {
            project,
            width: 0,
            height: 0,
            zoom: 100,
            x: 0,
            y: 0,
        }
    }

    pub fn resize(&mut self, width: u32, height: u32) {
        self.width = width;
        self.height = height;
    }

    pub fn center_canvas(&mut self) {
        self.x = (self.width as i32 - self.project.borrow().width as i32) / 2;
        self.y = (self.height as i32 - self.project.borrow().height as i32) / 2;
    }

    pub fn get_pixel(&self, x: u32, y: u32) -> Option<Pixel> {
        if x > self.width || y > self.height {
            return None;
        }

        // x and y relative to the project
        let rel_x: i32 = x as i32 - self.x;
        let rel_y: i32 = y as i32 - self.y;

        // active layer border
        if let Some(layer) = self.project.borrow().get_active_layer() {
            if layer.coord_is_on_border(rel_x, rel_y) {
                return Some([255, 255, 0, 255]);
            }
        }

        // zone outside the project
        if rel_x < 0 || rel_y < 0 {
            return Some([0, 0, 0, 0]);
        }
        if rel_x > self.project.borrow().width as i32 || rel_y > self.project.borrow().height as i32
        {
            return Some([0, 0, 0, 0]);
        }

        let p = self
            .project
            .borrow()
            .get_pixel(rel_x as u32, rel_y as u32)
            .unwrap();

        /* if it's opaque, return the pixel */
        if p[3] == 255 {
            return Some(p);
        }

        /* if not, blend with the background checkerboard */
        let c = get_background_pixel(rel_x as u32, rel_y as u32);
        Some(blend_pixels(c, p))
    }

    pub fn to_vec(&self) -> Vec<u8> {
        let mut v: Vec<u8> = vec![];
        (0..self.height).for_each(|j| {
            (0..self.width).for_each(|i| {
                let slice = self.get_pixel(i, j).unwrap();
                v.extend_from_slice(&slice);
            })
        });
        v
    }
}

fn get_background_pixel(x: u32, y: u32) -> Pixel {
    const square_size: u32 = 10;
    const grey_1: Pixel = [135, 135, 135, 255];
    const grey_2: Pixel = [90, 90, 90, 255];
    // (x / dimSq) + (y / dimSq) % 2 == 0;
    if ((x / square_size) + (y / square_size)).rem_euclid(2) == 0 {
        return grey_1;
    } else {
        return grey_2;
    }
}

#[cfg(test)]
mod tests {
    use super::*;

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
        p.get_active_layer_mut()
            .unwrap()
            .fill_selection(&selection, &Colour::WHITE);
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
        assert_eq!(workspace.get_pixel(0, 0).unwrap(), [0, 0, 0, 0]);
        assert_eq!(workspace.get_pixel(5, 3).unwrap(), [0, 0, 0, 0]);

        // assert that pixels on the edge of the active layer are yellow
        // assert_eq!(workspace.get_pixel(1, 1).unwrap(), [255, 255, 0, 255]);
        assert_eq!(workspace.get_pixel(4, 4).unwrap(), [255, 255, 0, 255]);

        // assert that a pixel within the project is white
        assert_eq!(workspace.get_pixel(2, 2).unwrap(), [255, 255, 255, 255]);
        assert_eq!(workspace.get_pixel(3, 3).unwrap(), [255, 255, 255, 255]);
    }

    #[test]
    fn to_vec() {
        let project = Rc::new(RefCell::new(Project::new("Untitled", 1, 1)));
        let mut workspace = Workspace::new(Rc::clone(&project));
        workspace.resize(3, 3);
        workspace.center_canvas();

        // assert_eq!(workspace.to_vec(), vec![
        //     0, 0, 0, 0,         255, 255, 0, 255,       255, 255, 0, 255,
        //     255, 255, 0, 255,   0, 0, 0, 0,             255, 255, 0, 255,
        //     255, 255, 0, 255,   255, 255, 0, 255,       255, 255, 0, 255]
        // );
    }
}
