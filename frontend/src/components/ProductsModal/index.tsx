import { Close } from "@mui/icons-material";
import {
    Modal,
    Box,
    Button,
    TableContainer,
    Paper,
    TableCell,
    TableRow,
} from "@mui/material";
import axios from "axios";
import { forwardRef, useContext } from "react";
import { useEffect, useState } from "react";
import { TableVirtuoso } from "react-virtuoso";
import Product from "../Products";
import { ModalProps } from "../common/ModalProps";
import { AlertContext } from "../../contexts/alertContext";

export default function ProductsModal({
    open,
    setOpen,
    setFunction,
}: ModalProps) {
    const { setAlertMessage, setAlertSeverity, setAlertVisibility } =
        useContext(AlertContext);
    const [productsList, setProductsList] = useState([]);
    const [productIndex, setProductIndex] = useState(-1);
    const setProduct = setFunction;

    useEffect(() => {
        if (open) {
            axios
                .get("http://localhost:8000/api/products/")
                .then((res) => {
                    setProductsList(res.data);
                })
                .catch(() => {
                    setAlertMessage(`Could not retrieve the products.`);
                    setAlertSeverity("error");
                    setAlertVisibility(true);
                });
        }
    }, [open]);

    const TableComponents = {
        Scroller: forwardRef<HTMLDivElement>((props, ref) => (
            <TableContainer component={Paper} {...props} ref={ref} />
        )),
    };

    const fixedHeaderContent = () => {
        return (
            <TableRow>
                <TableCell
                    variant="head"
                    align="right"
                    sx={{
                        backgroundColor: "background.paper",
                    }}
                >
                    Product Number
                </TableCell>
            </TableRow>
        );
    };

    const handleRowClick = (index: React.SetStateAction<number>) => {
        setProductIndex(index);
        if (index === productIndex) {
            setProduct(productsList[index]);
            setOpen(false);
        }
    };

    const rowContent = (_index: number, row: typeof Product) => {
        return (
            <>
                <TableRow
                    selected={_index === productIndex}
                    onClick={() => handleRowClick(_index)}
                >
                    <TableCell align="right">{row.product_number}</TableCell>
                </TableRow>
            </>
        );
    };

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
                        bgcolor: "background.paper",
                        border: "2px solid #000",
                        boxShadow: 24,
                        p: 4,
                    }}
                >
                    <Button onClick={() => setOpen(false)}>
                        <Close />
                        Close
                    </Button>
                    <Paper style={{ height: 400, width: "100%" }}>
                        <TableVirtuoso
                            data={productsList}
                            components={TableComponents}
                            fixedHeaderContent={fixedHeaderContent}
                            itemContent={rowContent}
                        />
                    </Paper>
                </Box>
            </Modal>
        </>
    );
}
