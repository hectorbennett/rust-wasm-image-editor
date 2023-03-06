import { Box } from "@mantine/core";
import Layers from "./Layers";

export default function RightPane() {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                margin: 10,
                width: "100%",
            }}
        >
            <Layers />
        </Box>
    );
}
