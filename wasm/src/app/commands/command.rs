pub trait Command {
    fn name(&self) -> String;
    fn execute(&self);
    fn rollback(&self);
}
