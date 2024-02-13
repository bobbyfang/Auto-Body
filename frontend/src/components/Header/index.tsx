import {
    Box,
    Button,
    IconButton,
    Toolbar,
    Typography,
    styled,
} from "@mui/material";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import MenuIcon from "@mui/icons-material/Menu";
import { drawerWidth } from "../common";
import axios from "axios";

interface Props {
    token: string;
    setToken: any;
    drawerOpen: boolean;
    handleDrawerOpen: any;
    app: string;
    // setApp: any,
}

export default function Header({
    token,
    setToken,
    drawerOpen,
    handleDrawerOpen,
    app,
}: Props) {
    const AppBar = styled(MuiAppBar, {
        shouldForwardProp: (prop) => prop !== "open",
    })<MuiAppBarProps>(({ theme, open }) => ({
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        ...(open && {
            marginLeft: drawerWidth,
            width: `calc(100% - ${drawerWidth}px)`,
            transition: theme.transitions.create(["width", "margin"], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
        }),
    }));

    const handleLogout = () => {
        axios
            .post("http://localhost:8000/auth/logout/", null, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .catch((error) => {
                console.log(error);
            });
        setToken("");
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="fixed" open={drawerOpen}>
                <Toolbar>
                    <IconButton
                        onClick={handleDrawerOpen}
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{
                            mr: 2,
                            ...(drawerOpen && { display: "none" }),
                        }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{ flexGrow: 1 }}
                        align="left"
                    >
                        {app}
                    </Typography>
                    <Button color="inherit" onClick={handleLogout}>
                        Logout
                    </Button>
                </Toolbar>
            </AppBar>
        </Box>
    );
}
