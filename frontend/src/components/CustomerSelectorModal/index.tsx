import { Close, Done } from "@mui/icons-material";
import { Modal, Box, Button, Grid } from "@mui/material";
import { ModalProps } from "../common/ModalProps";
import { useContext, useEffect, useState } from "react";
import { Customer } from "../Customers";
import axios from "axios";
import SingleClickDataGrid from "../common/SingleClickDataGrid";
import { GridInputRowSelectionModel } from "@mui/x-data-grid";
import _ from "lodash";
import { AlertContext } from "../../contexts/alertContext";

export default function CustomerSelectorModal({
    open,
    setOpen,
    setFunction,
}: ModalProps) {
    const { setAlertMessage, setAlertVisibility, setAlertSeverity } =
        useContext(AlertContext);
    const setCustomer = setFunction;
    const [customers, setCustomers] = useState<Customer[]>([]);

    const [selectionModel, setSelectionModel] =
        useState<GridInputRowSelectionModel>([]);

    const columns = [
        {
            field: "customer_number",
            headerName: "Customer Number",
            minWidth: 200,
        },
        {
            field: "name",
            headerName: "Customer Name",
            minWidth: 200,
        },
    ];

    useEffect(() => {
        if (open) {
            setSelectionModel([]);
            axios
                .get("http://localhost:8000/api/customers/")
                .then((res) => {
                    setCustomers(res.data);
                })
                .catch(() => {
                    setAlertMessage("Could not load the list of customers.");
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
                        width: 400,
                        minHeight: 400,
                        height: 400,
                        bgcolor: "background.paper",
                        border: "2px solid #000",
                        boxShadow: 24,
                        padding: 4,
                    }}
                >
                    <Grid container flexDirection="column" height="auto">
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
                                        setCustomer(selectionModel);
                                        setOpen(false);
                                        setSelectionModel([]);
                                    }}
                                >
                                    <Done />
                                    Select
                                </Button>
                            </Grid>
                        </Grid>
                        <Grid item flexGrow={1}>
                            <SingleClickDataGrid
                                props={{
                                    hideFooter: true,
                                    rows: customers,
                                    columns: columns,
                                    onRowDoubleClick: (row) => {
                                        setCustomer(row.id);
                                        setOpen(false);
                                    },
                                    getRowId: (row) => row.customer_number,
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
