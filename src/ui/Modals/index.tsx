import CreateNewProject from "./CreateNewProject";
import ResizeCanvas from "./ResizeCanvas";

const modals = {
    "file.new": CreateNewProject,
    "file.export": CreateNewProject,
    "image.resize_canvas": ResizeCanvas,
};

export default modals;
