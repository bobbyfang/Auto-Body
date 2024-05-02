import { Box, Button, Grid, Modal } from "@mui/material";
import { ModalProps } from "../common/ModalProps";
import { Check, Close } from "@mui/icons-material";
import SingleClickDataGrid from "../common/SingleClickDataGrid";
import { GridColDef } from "@mui/x-data-grid";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AlertContext } from "../../contexts/alertContext";
import { ReferenceContext } from "../../contexts/referenceContext";

export default function TransferQuotationModal({
    ModalProps,
}: {
    ModalProps: ModalProps;
}) {
    const { setAlertMessage, setAlertVisibility, setAlertSeverity } =
        useContext(AlertContext);

    const { reference_item, customer, user } = useContext(ReferenceContext);
    const [tableRows, setTableRows] = useState<any>([]);

    useEffect(() => {
        if (ModalProps.open) {
            Promise.all(
                reference_item.items.map((row) =>
                    axios
                        .get(
                            `http://localhost:8000/api/products/${row.product}/`
                        )
                        .then((res) => {
                            const o = {
                                ...row,
                                available_quantity: res.data.quantity,
                            };
                            return o;
                        })
                        .catch()
                )
            ).then((values) => setTableRows(values));
        }
    }, [ModalProps.open]);

    const columns: GridColDef[] = [
        { field: "product", headerName: "Item Number", minWidth: 200 },
        { field: "description", headerName: "Description", minWidth: 300 },
        {
            field: "quantity",
            headerName: "Quantity",
            minWidth: 50,
            editable: true,
        },
        {
            field: "available_quantity",
            headerName: "Available Quantity",
            minWidth: 150,
        },
    ];

    const isNotValid: () => boolean = () => {
        var count = 0;
        for (let i = 0; i < tableRows.length; i++) {
            if (tableRows[i].quantity > tableRows[i].available_quantity) {
                return true;
            }
            count += tableRows[i].quantity > 0 ? 1 : 0;
        }
        if (count === 0) {
            return true;
        }
        return false;
    };

    const processRowUpdate: (newRow: any, oldRow: any) => any = (
        newRow,
        oldRow
    ) => {
        if (isNaN(newRow.quantity)) {
            return oldRow;
        } else {
            setTableRows((rows: any) =>
                rows.map((row: any) =>
                    row.id === newRow.id
                        ? { ...newRow, quantity: Number(newRow.quantity) }
                        : { ...row }
                )
            );
            return newRow;
        }
    };

    const sendToOrder = () => {
        const items = tableRows.filter((row: any) => row.quantity !== 0);

        axios
            .post(`http://localhost:8000/api/orders/?expand=items`, {
                ...reference_item,
                items,
                user: user.id,
            })
            .then(() => {
                setAlertMessage(
                    `Quotation ${reference_item.reference_number} was transferred to orders.`
                );
                setAlertSeverity("success");
                setAlertVisibility(true);
                ModalProps.setOpen(false);
            })
            .catch(() => {
                setAlertMessage(
                    `Could not transfer quotation ${reference_item.reference_number} to orders.`
                );
                setAlertSeverity("error");
                setAlertVisibility(true);
            });
    };

    return (
        <>
            <Modal
                open={ModalProps.open}
                onClose={() => ModalProps.setOpen(false)}
            >
                <Box
                    sx={{
                        position: "absolute" as "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: "80%",
                        minHeight: 400,
                        height: 400,
                        bgcolor: "background.paper",
                        border: "2px solid #000",
                        boxShadow: 24,
                        padding: 4,
                    }}
                >
                    <Grid container flexDirection="column" height="100%">
                        <Grid container justifyContent="space-between">
                            <Grid item>
                                <Button
                                    onClick={() => {
                                        ModalProps.setOpen(false);
                                    }}
                                >
                                    <Close />
                                    Close
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button
                                    disabled={isNotValid()}
                                    onClick={sendToOrder}
                                >
                                    <Check />
                                    Send to Orders
                                </Button>
                            </Grid>
                        </Grid>
                        <Grid item flexGrow={1}>
                            <SingleClickDataGrid
                                props={{
                                    hideFooter: true,
                                    columns: columns,
                                    rows: tableRows,
                                    processRowUpdate: processRowUpdate,
                                }}
                            />
                        </Grid>
                    </Grid>
                </Box>
            </Modal>
        </>
    );
}
