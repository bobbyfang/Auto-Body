import { Outlet } from "react-router-dom";
import Header from "../../components/Header";
import { Box } from "@mui/material";
import { useState } from "react";
import SideDrawer from "../../components/SideDrawer";
import Customers from "../../components/Customers";
import Products from "../../components/Products";

interface Props {
    token: string,
    setToken: any,
}

export default function DashboardLayout( {token, setToken}: Props ) {
    const [drawerOpen, setDrawerOpen] = useState(false);

    const handleDrawerOpen = () => {
        setDrawerOpen(true);
    };

    const handleDrawerClose = () => {
        setDrawerOpen(false);
    };

    const [app, setApp] = useState("");

    const content = (app: string) => {
        switch(app) {
            case "Quotes":
                return (<h1>Quotes</h1>);
            case "Orders":
                return (<h1>Orders</h1>);
            case "Invoices":
                return (<h1>Invoices</h1>);
            case "Customers":
                return (<Customers />);
            case "Products":
                return (<Products />);
            default:
                return (<h1>Empty</h1>)
        }
    }

    return (
        <>
            <Header 
                token={token}
                setToken={setToken}
                drawerOpen={drawerOpen}
                handleDrawerOpen={handleDrawerOpen} 
                app={app} />
            <SideDrawer
                drawerOpen={drawerOpen}
                handleDrawerClose={handleDrawerClose} 
                setApp={setApp} />
            <Box component="main" sx={{
                position: "absolute",

                top: "60px",
                left: "60px",
                right: "0px",
                height: "auto",
                width: "auto",
                padding: "20px",
            }}>
                {content(app)}
            </Box>
        </>
    );
}