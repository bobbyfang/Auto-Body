import { ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import InboxIcon from "@mui/icons-material/Inbox";

export default function SideDrawerItem( {text, drawerOpen, setApp} ) {
    const handleButtonClick = (event: any) => {
        const appName = event.currentTarget.getAttribute('name');
        setApp(appName);
    };

    return (
        <ListItem key={text} disablePadding sx={{}}>
            <ListItemButton
                name={text}
                sx={{
                    minHeight: 48,
                    justifyContent: drawerOpen ? 'initial' : 'center',
                    px: 2.5,
                }}
                onClick={handleButtonClick}
            >
                <ListItemIcon
                    sx={{
                        minWidth: 0,
                        mr: drawerOpen ? 3 : 'auto',
                        justifyContent: 'center',
                    }}
                >
                    <InboxIcon />
                </ListItemIcon>
                <ListItemText
                    primary={text}
                    sx={{display: drawerOpen ? 'left' : 'none'}} />
            </ListItemButton>
        </ListItem>
    );
}