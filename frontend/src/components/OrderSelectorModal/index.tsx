import { Close, Done } from "@mui/icons-material";
import { Modal, Box, Grid, Button } from "@mui/material";
import { GridInputRowSelectionModel, GridColDef } from "@mui/x-data-grid";
import axios from "axios";
import _ from "lodash";
import { useState, useEffect, useContext } from "react";
import { ModalProps } from "../common/ModalProps";
import SingleClickDataGrid from "../common/SingleClickDataGrid";
import { Order } from "../Orders";
import { AlertContext } from "../../contexts/alertContext";

export default function OrderSelectorModal({
    open,
    setOpen,
    setFunction,
}: ModalProps) {
    const { setAlertMessage, setAlertVisibility, setAlertSeverity } =
        useContext(AlertContext);
    const setInvoice = setFunction;
    const [orders, setOrders] = useState<Order[]>([]);

    const [selectionModel, setSelectionModel] =
        useState<GridInputRowSelectionModel>([]);

    const columns: GridColDef[] = [
        {
            field: "reference_number",
            headerName: "Reference Number",
            minWidth: 150,
        },
        {
            field: "customer",
            headerName: "Customer",
            minWidth: 200,

            valueGetter: ({ row }) => {
                return `${row.customer.name}`;
            },
        },
        {
            field: "user",
            headerName: "User",
            minWidth: 150,

            valueGetter: ({ row }) => {
                return `${row.user.first_name} ${row.user.last_name}`;
            },
        },
    ];

    useEffect(() => {
        if (open) {
            setSelectionModel([]);
            axios
                .get(
                    "http://localhost:8000/api/orders/?expand=items,user,customer"
                )
                .then((res) => {
                    const data: [] = res.data;
                    data.sort(
                        (a: any, b: any) =>
                            b.reference_number - a.reference_number
                    );
                    setOrders(data);
                })
                .catch(() => {
                    setAlertMessage("Could not load the list of orders.");
                    setAlertSeverity("error");
                    setAlertVisibility(true);
                });
        }
    }, [open]);

    return (
        <>
            <Modal open={open} onClose={() => setOpen(false)}>
                <Box
                    sx={{
                        position: "absolute" as "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        minWidth: 400,
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
                                <Button onClick={() => setOpen(false)}>
                                    <Close />
                                    Close
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button
                                    disabled={
                                        _.isEmpty(selectionModel) ||
                                        selectionModel === ""
                                    }
                                    onClick={() => {
                                        setInvoice(selectionModel);
                                        setOpen(false);
                                        setSelectionModel([]);
                                    }}
                                >
                                    <Done />
                                    Select
                                </Button>
                            </Grid>
                        </Grid>
                        <Grid item flexGrow={1} height={100}>
                            <SingleClickDataGrid
                                props={{
                                    hideFooter: true,
                                    rows: orders,
                                    columns: columns,
                                    onRowDoubleClick: (row) => {
                                        setInvoice(row.id);
                                        setOpen(false);
                                    },
                                    getRowId: (row) => row.reference_number,
                                    rowSelectionModel: selectionModel,
                                    onRowSelectionModelChange: (newValue) => {
                                        setSelectionModel(newValue[0]);
                                    },
                                }}
                            />
                        </Grid>
                    </Grid>
                </Box>
            </Modal>
        </>
    );
}
