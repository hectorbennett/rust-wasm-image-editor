use std::cmp;

use super::commands::command::Command;

pub struct History {
    // A log of all the commands in their execution order
    pub history: Vec<Box<dyn Command>>,

    // Where we have executed up to so far
    pub cursor: usize,

    // The position in the history we want to execute to
    pub revision: usize,
}

impl Default for History {
    fn default() -> Self {
        Self::new()
    }
}

impl History {
    pub fn new() -> History {
        History {
            history: vec![],
            cursor: 0,
            revision: 0,
        }
    }

    pub fn append(&mut self, command: Box<dyn Command>) {
        // Destroy anything ahead of the current revision
        self.history.truncate(self.revision);

        // Add a command to the history
        self.history.push(command);

        // Move forward one step in the history
        self.revision += 1;
    }

    pub fn execute(&mut self) {
        // Execute all the methods that have not yet been executed
        for i in self.cursor..self.revision {
            self.history[i].execute();
        }

        // Move the cursor forward
        self.cursor = self.revision
    }

    pub fn undo(&mut self) {
        if self.history.is_empty() {
            return;
        }

        // Move back 1 revision
        self.revision = cmp::max(0, self.revision - 1);
        self.cursor = self.revision;

        // Undo the current command
        self.history[self.revision].rollback();
    }

    pub fn redo(&mut self) {
        if self.revision == self.history.len() {
            return;
        }

        // Redo the current command
        self.history[self.revision].execute();

        // Move forward 1 revision (again) to where we previously were in history
        self.revision += 1;
        self.cursor = self.revision;
    }
}
