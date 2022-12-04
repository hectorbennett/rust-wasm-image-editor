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
