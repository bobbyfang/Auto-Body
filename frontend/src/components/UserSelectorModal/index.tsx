import { Close, Done } from "@mui/icons-material";
import { Modal, Box, Button, Grid } from "@mui/material";
import { ModalProps } from "../common/ModalProps";
import { useEffect, useState } from "react";
import axios from "axios";
import SingleClickDataGrid from "../common/SingleClickDataGrid";
import { GridColDef, GridInputRowSelectionModel } from "@mui/x-data-grid";
import _ from "lodash";
import { User } from "../common/User";

export default function UserSelectorModal({
    open,
    setOpen,
    setAlertMessage,
    setAlertVisibility,
    setSeverity,
    setFunction,
}: ModalProps) {
    const setUser = setFunction;
    const [users, setUsers] = useState<User[]>([]);

    const [selectionModel, setSelectionModel] =
        useState<GridInputRowSelectionModel>([]);

    const columns: GridColDef[] = [
        {
            field: "username",
            headerName: "Username",
            minWidth: 200,
        },
        {
            field: "first_name",
            headerName: "User",
            minWidth: 200,

            valueGetter: ({ row }) => {
                return `${row.first_name} ${row.last_name}`;
            },
        },
    ];

    useEffect(() => {
        if (open) {
            setSelectionModel([]);
            axios
                .get("http://localhost:8000/api/users/")
                .then((res) => {
                    setUsers(res.data);
                })
                .catch(() => {
                    setAlertMessage("Could not load the list of users.");
                    setSeverity("error");
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
                                        setUser(selectionModel);
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
                                    rows: users,
                                    columns: columns,
                                    onRowDoubleClick: (row) => {
                                        setUser(row.id);
                                        setOpen(false);
                                    },
                                    getRowId: (row) => row.username,
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
