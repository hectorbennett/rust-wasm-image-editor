import { ReactNode, useState } from "react";

import { createStyles, useMantineTheme, Box } from "@mantine/core";

import Resizable, { Size } from "../components/Resizable";

import Header from "./Header";
import { TabBar } from "./TabBar";
import RightPane from "./RightPane";
import LeftPane from "./LeftPane";

// const PANE_WIDTH = 200;
const HEADER_HEIGHT = 36;
const FOOTER_HEIGHT = 36;
const TAB_BAR_HEIGHT = 36;

const useStyles = createStyles((theme, _params, getRef) => ({
    container: {
        position: "fixed",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
    },
    main: {
        display: "flex",
        flex: 1,
    },
    header: {
        minHeight: HEADER_HEIGHT,
        display: "flex",
        background: theme.colors.dark[6],
    },
    leftPane: {
        height: `calc(100vh - ${HEADER_HEIGHT + FOOTER_HEIGHT}px)`,
        display: "flex",
        background: theme.colors.dark[7],
    },
    canvasOuter: {
        flex: 1,
        height: "100%",
    },
    tabBar: {
        height: TAB_BAR_HEIGHT,
        display: "flex",
        overflow: "scroll",
        background: theme.colors.dark[6],
    },
    canvasInner: {
        height: `calc(100vh - ${HEADER_HEIGHT + TAB_BAR_HEIGHT + FOOTER_HEIGHT}px)`,
        background: theme.colors.dark[5],
    },
    rightPane: {
        height: `calc(100vh - ${HEADER_HEIGHT + FOOTER_HEIGHT}px)`,
        display: "flex",
        background: theme.colors.dark[7],
    },
    footer: {
        background: theme.colors.dark[6],
        height: FOOTER_HEIGHT,
    },
}));

interface UiProps {
  width: number;
  children: ReactNode;
}

export default function Ui(props: UiProps) {
    const { classes } = useStyles();
    const theme = useMantineTheme();
    const [leftPaneWidth, setLeftPaneWidth] = useState(200);
    const [rightPaneWidth, setRightPaneWidth] = useState(200);

    return (
        <Box
            className={classes.container}
            sx={{
                background: theme.colors.dark[5],
            }}
        >
            <div className={classes.header}>
                <Header />
            </div>
            <div className={classes.main}>
                <Resizable
                    className={classes.leftPane}
                    handles={["right"]}
                    width={leftPaneWidth}
                    onResize={({ width, height }: Size) =>
                        setLeftPaneWidth(width as number)
                    }
                >
                    <LeftPane />
                </Resizable>
                <div
                    className={classes.canvasOuter}
                    style={{ width: `calc(100% - ${leftPaneWidth + rightPaneWidth}px)` }}
                >
                    <div className={classes.tabBar}>
                        <TabBar />
                    </div>
                    <div className={classes.canvasInner}>{props.children}</div>
                </div>
                <Resizable
                    className={classes.rightPane}
                    handles={["left"]}
                    width={rightPaneWidth}
                    onResize={({ width, height }: Size) =>
                        setRightPaneWidth(width as number)
                    }
                >
                    <RightPane />
                </Resizable>
            </div>
            <div className={classes.footer}>Footer</div>
        </Box>
    );
}
