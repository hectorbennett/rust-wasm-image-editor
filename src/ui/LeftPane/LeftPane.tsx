import { Box, Divider } from "@mantine/core";
import Tools from "./Tools";
import ColourSelect from "./ColourSelect";

export default function LeftPane() {
    return (
        <Box sx={{ display: "flex", flexDirection: "column", margin: 10 }}>
            <Tools />
            <Divider my="sm" />
            <ColourSelect />
        </Box>
    );
}
