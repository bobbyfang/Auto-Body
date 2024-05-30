import Header from "../../components/Header";
import { Box } from "@mui/material";
import { useState } from "react";
import SideDrawer from "../../components/SideDrawer";
import Customers from "../../components/Customers";
import Products from "../../components/Products";
import Quotes from "../../components/Quotations";
import Orders from "../../components/Orders";
import Invoices from "../../components/Invoices";
import CreditNotes from "../../components/CreditNotes";
import {
    Page,
    View,
    Document,
    Text,
    StyleSheet,
    PDFViewer,
} from "@react-pdf/renderer";
import InvoicePDF from "../../pdfs/InvoicePDF";

interface Props {
    token: string;
    setToken: any;
}

export default function DashboardLayout({ token, setToken }: Props) {
    const [drawerOpen, setDrawerOpen] = useState(false);

    const handleDrawerOpen = () => {
        setDrawerOpen(true);
    };

    const handleDrawerClose = () => {
        setDrawerOpen(false);
    };

    const [app, setApp] = useState("");

    const styles = StyleSheet.create({
        page: {
            flexDirection: "column",
            backgroundColor: "#E4E4E4",
            padding: 10,
        },
        section: {
            margin: "5 5 0 5",
            fontSize: 12,

            // padding: 10,
            // flexGrow: 1,
        },
    });

    const MyDocument = () => (
        <Document>
            <Page
                size="A4"
                orientation="portrait"
                style={{ ...styles.page, maxHeight: "50vh" }}
            >
                <View style={{ flexDirection: "row", alignItems: "baseline" }}>
                    <View
                        style={{
                            flex: 1,
                        }}
                    >
                        <Text style={{ fontSize: 12 }}>DATE:{"  "}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text
                            style={{
                                alignSelf: "center",
                                borderStyle: "solid",
                                borderWidth: 1,
                                padding: "2 20",
                                fontSize: "20",
                            }}
                        >
                            TAX INVOICE
                        </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={{ alignSelf: "flex-end", fontSize: 12 }}>
                            REF NO:{" "}
                        </Text>
                    </View>
                </View>
                <View style={styles.section} debug>
                    <Text style={{ textAlign: "center" }}>RUYI AUTOMOTIVE</Text>
                </View>
                <View style={styles.section} debug>
                    <Text style={{ textAlign: "center" }}>
                        734 Govan Mbeki Ave, North End, Port Elizabeth
                    </Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "baseline" }}>
                    <View style={{ ...styles.section, flex: 1 }}>
                        {/* <Text></Text> */}
                    </View>
                    <View style={{ ...styles.section, flex: 1 }}>
                        <Text>
                            TEL:{" "}
                            <Text style={{ fontSize: 10 }}>041 484 3727/4</Text>
                        </Text>
                    </View>
                    <View style={{ ...styles.section, flex: 1 }}>
                        {/* <Text></Text> */}
                    </View>
                    <View style={{ ...styles.section, flex: 1 }}>
                        <Text>
                            VAT NO:{" "}
                            <Text style={{ fontSize: 10 }}>4830248706</Text>
                        </Text>
                    </View>
                    <View style={{ ...styles.section, flex: 1 }}>
                        <Text>
                            CK NO:{" "}
                            <Text style={{ fontSize: 8 }}>2008/107611/23</Text>
                        </Text>
                    </View>
                </View>
                <View style={{ flexDirection: "row", alignItems: "baseline" }}>
                    <View
                        style={{
                            ...styles.section,
                            flex: 2,
                            flexDirection: "column",
                        }}
                    >
                        <Text>TO:{"\t"}</Text>
                        <Text>{}</Text>
                    </View>
                    <View
                        style={{
                            ...styles.section,
                            flex: 1,
                            flexDirection: "column",
                        }}
                    >
                        <Text>VAT NO: {}</Text>
                        <Text>ORD NO: {}</Text>
                        <Text>TEL: {}</Text>
                    </View>
                    <View
                        style={{
                            ...styles.section,
                            flex: 1,
                            flexDirection: "column",
                        }}
                    >
                        <Text>INVOICE NO: {}</Text>
                        <Text>TERM: {}</Text>
                        <Text>MEMO: {}</Text>
                    </View>
                    <View
                        style={{
                            ...styles.section,
                            flex: 1,
                            flexDirection: "column",
                        }}
                    >
                        <Text>SALES: {}</Text>
                        <Text>AREA: {}</Text>
                        <Text></Text>
                    </View>
                </View>
            </Page>
        </Document>
    );

    const content = (app: string) => {
        switch (app) {
            case "Quotes":
                return <Quotes />;
            case "Orders":
                return <Orders />;
            case "Invoices":
                return <Invoices />;
            case "Credit Notes":
                return <CreditNotes />;
            case "Customers":
                return <Customers />;
            case "Products":
                return <Products />;
            default:
                return (
                    <>
                        <PDFViewer width={500} height={500}>
                            {/* <InvoicePDF /> */}
                            <MyDocument />
                        </PDFViewer>
                    </>
                );
        }
    };

    return (
        <>
            <Header
                token={token}
                setToken={setToken}
                drawerOpen={drawerOpen}
                handleDrawerOpen={handleDrawerOpen}
                app={app}
            />
            <SideDrawer
                drawerOpen={drawerOpen}
                handleDrawerClose={handleDrawerClose}
                setApp={setApp}
            />
            <Box
                component="main"
                sx={{
                    position: "absolute",

                    top: "60px",
                    left: "60px",
                    right: "0px",
                    bottom: "0px",
                    minHeight: "100",
                    // height: "auto",
                    // width: "auto",
                    padding: "20px",
                }}
            >
                {content(app)}
            </Box>
        </>
    );
}
