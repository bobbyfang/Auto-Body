import { Box, Button, Grid, Modal, TextField } from "@mui/material";
import { ModalProps } from "../common/ModalProps";
import { Check, Close } from "@mui/icons-material";
import { ReactNode } from "react";

export default function ConfirmationDialogue({
    modalProps,
    message,
    onConfirm,
}: {
    modalProps: ModalProps;
    message: ReactNode;
    onConfirm: () => void;
}) {
    return (
        <>
            <Modal
                open={modalProps.open}
                onClose={() => {
                    modalProps.setOpen(false);
                }}
            >
                <Box
                    sx={{
                        position: "absolute" as "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 400,
                        minHeight: "auto",
                        height: "auto",
                        bgcolor: "background.paper",
                        border: "2px solid #000",
                        boxShadow: 24,
                        padding: 4,
                    }}
                >
                    <Grid container>
                        <Grid item width="100%">
                            {message}
                        </Grid>
                        <Grid container justifyContent="space-between">
                            <Grid item>
                                <Button
                                    onClick={() => {
                                        modalProps.setOpen(false);
                                    }}
                                >
                                    <Close />
                                    Cancel
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button
                                    onClick={() => {
                                        try {
                                            onConfirm();
                                            modalProps.setOpen(false);
                                        } catch (error) {
                                            console.log(error);
                                        }
                                    }}
                                >
                                    <Check />
                                    Confirm
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>
            </Modal>
        </>
    );
}
