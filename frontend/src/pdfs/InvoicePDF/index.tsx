import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { Invoice } from "../../components/Invoices";

export default function InvoicePDF() {
    // details: { details: Invoice }
    // details;
    const styles = StyleSheet.create({
        page: {
            flexDirection: "column",
            backgroundColor: "#E4E4E4",
            // marginTop: "10cm",
        },
        section: {
            margin: 10,
            padding: 10,
            // flexGrow: 1,
        },
    });

    const MyDocument = () => (
        <Document>
            <Page size="A4" orientation="landscape" style={styles.page}>
                <View style={[styles.section]} debug>
                    <Text>TAX INVOICE</Text>
                </View>
                <View style={styles.section} debug>
                    <Text>Section #2</Text>
                </View>
                <View style={styles.section} debug>
                    <Text>Section #2</Text>
                </View>
            </Page>
        </Document>
    );
    return <MyDocument />;
}
