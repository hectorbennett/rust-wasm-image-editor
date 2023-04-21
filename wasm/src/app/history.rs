use std::cmp;

use super::commands::command::{merge_commands, Command};

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

        // either merge the command with the previous one,
        // or add a new command and increase the revision
        if self.should_merge_command_with_previous(&command) {
            self.merge_command_with_previous(command);
        } else {
            self.add_new_command(command);
        }

        // execute the command
        self.history.last().unwrap().execute();
    }

    fn should_merge_command_with_previous(&self, command: &Box<dyn Command>) -> bool {
        // If the previous command is of the same type and executed very recently, return true
        match self.history.last() {
            Some(previous_command) => {
                if command.name() == previous_command.name() {
                    true
                } else {
                    false
                }
            }
            None => false,
        }
    }

    fn merge_command_with_previous(&mut self, command: Box<dyn Command>) {
        // Replace the current command with an existing one. Do not increase the revision.
        let previous_command = self.history.pop().unwrap();
        let merged_command = merge_commands(previous_command, command);
        self.history.push(Box::new(merged_command));
    }

    fn add_new_command(&mut self, command: Box<dyn Command>) {
        // Add a new command to the history. Increase the revision.
        self.history.push(command);
        self.revision += 1;
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
