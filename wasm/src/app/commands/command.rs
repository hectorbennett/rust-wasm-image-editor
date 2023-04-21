pub trait Command {
    fn name(&self) -> String;
    fn execute(&self);
    fn rollback(&self);
}

pub struct MergedCommands {
    command_1: Box<dyn Command>,
    command_2: Box<dyn Command>,
}

impl MergedCommands {
    pub fn new(command_1: Box<dyn Command>, command_2: Box<dyn Command>) -> MergedCommands {
        MergedCommands {
            command_1,
            command_2,
        }
    }
}

impl Command for MergedCommands {
    fn name(&self) -> String {
        self.command_2.name()
    }

    fn execute(&self) {
        self.command_2.execute();
    }

    fn rollback(&self) {
        self.command_1.rollback();
    }
}

pub fn merge_commands(command_1: Box<dyn Command>, command_2: Box<dyn Command>) -> MergedCommands {
    MergedCommands::new(command_1, command_2)
}
