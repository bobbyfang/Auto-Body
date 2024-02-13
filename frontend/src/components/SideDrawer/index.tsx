import {
    CSSObject,
    Divider,
    IconButton,
    List,
    Theme,
    styled,
} from "@mui/material";
import MuiDrawer from "@mui/material/Drawer";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { drawerItems } from "./drawer-items";
import { drawerWidth } from "../common";
import SideDrawerItem from "./SideDrawerItem";

interface Props {
    drawerOpen: boolean;
    handleDrawerClose: any;
    setApp: any;
}

export default function SideDrawer({
    drawerOpen,
    handleDrawerClose,
    setApp,
}: Props) {
    const openedMixin = (theme: Theme): CSSObject => ({
        width: drawerWidth,
        transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
        overflowX: "hidden",
    });

    const closedMixin = (theme: Theme): CSSObject => ({
        transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: "hidden",
        width: `calc(${theme.spacing(7)} + 1px)`,
        [theme.breakpoints.up("sm")]: {
            width: `calc(${theme.spacing(8)} + 1px)`,
        },
    });

    const DrawerHeader = styled("div")(({ theme }) => ({
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
    }));

    const Drawer = styled(MuiDrawer, {
        shouldForwardProp: (prop) => prop !== "open",
    })(({ theme, open }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: "nowrap",
        boxSizing: "border-box",
        ...(open && {
            ...openedMixin(theme),
            "& .MuiDrawer-paper": openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            "& .MuiDrawer-paper": closedMixin(theme),
        }),
    }));

    return (
        <Drawer variant="permanent" open={drawerOpen}>
            <DrawerHeader>
                <IconButton onClick={handleDrawerClose}>
                    <ChevronLeftIcon />
                </IconButton>
            </DrawerHeader>
            <List>
                {drawerItems.map((text, index) => (
                    <SideDrawerItem
                        text={text}
                        drawerOpen={drawerOpen}
                        setApp={setApp}
                    />
                ))}
            </List>
            <Divider />
            <List>
                <SideDrawerItem
                    text="Customers"
                    drawerOpen={drawerOpen}
                    setApp={setApp}
                />
                <SideDrawerItem
                    text="Products"
                    drawerOpen={drawerOpen}
                    setApp={setApp}
                />
            </List>
        </Drawer>
    );
}
