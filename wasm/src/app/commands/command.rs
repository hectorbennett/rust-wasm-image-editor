pub trait Command {
    fn execute(&self);
    fn rollback(&self);
}
