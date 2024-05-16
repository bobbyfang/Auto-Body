import {
    FirstPage,
    NavigateBefore,
    NavigateNext,
    LastPage,
    LibraryAdd,
    Edit,
    Clear,
    Save,
    Grading,
    Print,
    PlaylistAddCheck,
} from "@mui/icons-material";
import { Box, Grid, Button, Divider, TextField } from "@mui/material";
import { GridInputRowSelectionModel } from "@mui/x-data-grid";
import axios, { AxiosResponse } from "axios";
import _ from "lodash";
import { useContext, useState, useEffect } from "react";
import CurrencyInput from "react-currency-input-field";
import { AlertContext } from "../../contexts/alertContext";
import SearchTextField from "../common/SearchTextField";
import SingleClickDataGrid from "../common/SingleClickDataGrid";
import CustomerSelectorModal from "../CustomerSelectorModal";
import { ProductPrice } from "../Products";
import UserSelectorModal from "../UserSelectorModal";
import OrderSelectorModal from "../OrderSelectorModal";
import useCustomer from "../../hooks/useCustomer";
import useUser from "../../hooks/useUser";
import { Invoice } from "../Invoices";

export interface CreditNoteItem {
    id: number | string;
    price: number;
    vat: number;
    subtotal: number;
    quantity: number;
    product: string;
    description: string;
}

export interface CreditNote {
    reference_number: string;
    items: CreditNoteItem[];
    created?: string;
    amount: number;
    vat: number;
    total: number;
    memo?: string;
    user: string;
    customer: string;
    credit_number: string;
    invoice_number: string;
}

export default function CreditNotes() {
    const { setAlertMessage, setAlertVisibility, setAlertSeverity } =
        useContext(AlertContext);

    const [modifying, setModifying] = useState(false);

    const [referenceSearchField, setReferenceSearchField] = useState("");

    const [referenceNumbers, setReferenceNumbers] = useState<CreditNote[]>([]);
    const [index, setIndex] = useState<number>(-1);
    const [referenceNumber, setReferenceNumber] = useState("");
    const [prevCreditNote, setPrevCreditNote] = useState<CreditNote>({
        reference_number: "",
        items: [],
        amount: 0.0,
        vat: 0.0,
        total: 0.0,
        customer: "",
        user: "",
        credit_number: "",
        invoice_number: "",
    });
    const [creditNote, setCreditNote] = useState<CreditNote>({
        reference_number: "",
        items: [],
        amount: 0.0,
        vat: 0.0,
        total: 0.0,
        customer: "",
        user: "",
        credit_number: "",
        invoice_number: "",
    });

    const [isCustomerModalOpen, setCustomerModalOpen] = useState(false);
    const [customerNumberField, setCustomerNumberField] = useState("");
    const { customer, setCustomer } = useCustomer();

    const [isSalespersonModalOpen, setSalespersonModalOpen] = useState(false);
    const [salespersonUsernameField, setSalespersonUsernameField] =
        useState("");
    const [user, setUser] = useUser();

    const [invoice, setInvoice] = useState<Invoice>({
        reference_number: "",
        items: [],
        amount: 0.0,
        vat: 0.0,
        total: 0.0,
        customer: "",
        user: "",
        invoice_number: "",
    });
    const [invoiceUser, setInvoiceUser] = useUser();

    const [items, setItems] = useState<{ [index: string]: any }>({});

    const [isOrderSelectModalOpen, setOrderSelectModalOpen] = useState(false);

    const [selectedIndex, setSelectedIndex] = useState<number | null>(0);
    const [selectionModel, setSelectionModel] =
        useState<GridInputRowSelectionModel>([]);

    const quotationColumns = [
        {
            field: "product",
            headerName: "Item Number",
            minWidth: 200,
            editable: modifying,
            valueParser: (value: string) => {
                return value.toUpperCase();
            },
        },
        {
            field: "description",
            headerName: "Description",
            flex: 1,
        },
        {
            field: "quantity",
            headerName: "Quantity",
            editable: modifying,
        },
        {
            field: "price",
            headerName: "Price",
            editable: modifying,
        },
        {
            field: "vat",
            headerName: "VAT",
        },
        {
            field: "subtotal",
            headerName: "Subtotal",
        },
    ];

    const load_reference_numbers_list = (
        action: (res: AxiosResponse<any, any>) => any
    ) => {
        axios
            .get(
                "http://localhost:8000/api/credit_notes/?only=reference_number"
            )
            .then(action)
            .catch(() => {
                setAlertMessage(
                    `Could not retrieve list of credit note reference numbers.`
                );
                setAlertSeverity("error");
                setAlertVisibility(true);
            });
    };

    useEffect(() => {
        load_reference_numbers_list((res) => {
            const credit_notes = res.data;
            setReferenceNumbers(credit_notes);
            setIndex(credit_notes.length - 1);
        });
    }, []);

    const goToReferenceAtIndex = () => {
        if (referenceNumbers.length) {
            setReferenceNumber(
                referenceNumbers[index].reference_number
                    ? referenceNumbers[index].reference_number
                    : ""
            );
        }
    };

    useEffect(() => {
        goToReferenceAtIndex();
    }, [index]);

    useEffect(() => {
        if (!_.isEqual(referenceNumber, "")) {
            axios
                .get(
                    `http://localhost:8000/api/credit_notes/${referenceNumber}/?expand=items,user`
                )
                .then((res) => {
                    const credit_note = res.data;
                    setPrevCreditNote({
                        ...credit_note,
                        user: credit_note.user.username,
                    });
                })
                .catch(() => {
                    setAlertMessage(
                        `Could not load credit note with reference number ${referenceNumber}.`
                    );
                    setAlertSeverity("error");
                    setAlertVisibility(true);
                });
        }
    }, [referenceNumber]);

    useEffect(() => {
        if (prevCreditNote.invoice_number) {
            setCreditNote(prevCreditNote);
            setCustomer(prevCreditNote.customer);
            setUser(prevCreditNote.user);
            axios
                .get(
                    `http://localhost:8000/api/invoices/${prevCreditNote.invoice_number}/?expand=user,creditnote_set__items,items`
                )
                .then((res) => {
                    setInvoice({ ...res.data, user: res.data.user.username });
                })
                .catch(() => {});
            setSelectionModel([]);
        }
    }, [prevCreditNote]);

    useEffect(() => {
        setInvoiceUser(invoice.user);
        var items: {
            [index: string]: {
                quantity: number;
                price: number;
                description: string;
            };
        } = {};
        for (const _item of invoice.items) {
            if (!(_item.product in items)) {
                items[_item.product] = {
                    quantity: Number(_item.quantity),
                    price: Number(_item.price),
                    description: _item.description,
                };
            } else {
                const item = items[_item.product];
                items[_item.product] = {
                    quantity: item.quantity + _item.quantity,
                    price: Math.max(item.price, _item.price),
                    description: _item.description,
                };
            }
        }
        if (invoice.creditnote_set) {
            for (const _credit_note of invoice.creditnote_set) {
                if (
                    _credit_note.reference_number !==
                    creditNote.reference_number
                ) {
                    for (const _item of _credit_note.items) {
                        if (_item.product in items) {
                            const item = items[_item.product];
                            items[_item.product] = {
                                ...item,
                                quantity: item.quantity - _item.quantity,
                            };
                        }
                    }
                }
            }
        }
        setItems(items);
    }, [invoice]);

    useEffect(() => {
        setCustomerNumberField(customer.customer_number);
        setCreditNote((prev): CreditNote => {
            return { ...prev, customer: customer.customer_number };
        });
    }, [customer]);

    useEffect(() => {
        setSalespersonUsernameField(user.username);
        setCreditNote((prev): CreditNote => {
            return { ...prev, user: user.username };
        });
    }, [user]);

    useEffect(() => {
        if (!modifying) {
            setCustomerNumberField(
                customer?.customer_number ? customer?.customer_number : ""
            );
            setSalespersonUsernameField(user?.username ? user?.username : "");
            setSelectionModel([]);
        }
    }, [modifying]);

    const getProductDetails = async (productID: string) => {
        const a = axios.get(`http://localhost:8000/api/products/${productID}/`);
        return a;
    };

    const calculateTotals = (items: CreditNoteItem[]) => {
        const totals = items.reduce(
            (prev, cur) => {
                return {
                    amount: prev.amount + Number(cur.price) * cur.quantity,
                    vat: prev.vat + Number(cur.vat),
                    total: prev.total + Number(cur.subtotal),
                };
            },
            { amount: 0.0, vat: 0.0, total: 0.0 }
        );
        return {
            amount: Number(totals.amount.toFixed(2)),
            vat: Number(totals.amount.toFixed(2)),
            total: Number(totals.total.toFixed(2)),
        };
    };

    return (
        <>
            <OrderSelectorModal
                open={isOrderSelectModalOpen}
                setOpen={setOrderSelectModalOpen}
                setFunction={(reference_number: string) => {
                    axios
                        .get(
                            `http://localhost:8000/api/orders/${reference_number}/?expand=items,user`
                        )
                        .then((res) => {
                            setCreditNote({
                                ...res.data,
                                reference_number: "",
                            });
                            setCustomer(res.data.customer);
                            setUser(res.data.user.username);
                            setModifying(true);
                        })
                        .catch();
                }}
            />
            <UserSelectorModal
                open={isSalespersonModalOpen}
                setOpen={setSalespersonModalOpen}
                setFunction={setUser}
            />
            <CustomerSelectorModal
                open={isCustomerModalOpen}
                setOpen={setCustomerModalOpen}
                setFunction={setCustomer}
            />
            <Box
                sx={{
                    height: "96%",
                    backgroundColor: "white",
                    padding: "20px",
                }}
            >
                <Grid
                    container
                    direction="column"
                    sx={{
                        height: "100%",
                        width: "100%",
                        maxHeight: "100%",
                        maxWidth: "100%",
                    }}
                    // overflow="auto"
                >
                    <Grid
                        container
                        sx={{ height: "auto" }}
                        alignItems="center"
                        flexDirection="row"
                    >
                        {/* First button */}
                        <Grid item>
                            <Button
                                onClick={() => {
                                    setIndex(0);
                                }}
                                disabled={modifying}
                            >
                                <FirstPage />
                            </Button>
                        </Grid>
                        {/* Previous button */}
                        <Grid item>
                            <Button
                                onClick={() => {
                                    setIndex(Math.max(0, index - 1));
                                }}
                                disabled={modifying}
                            >
                                <NavigateBefore />
                            </Button>
                        </Grid>
                        {/* Next button */}
                        <Grid item>
                            <Button
                                onClick={() => {
                                    setIndex(
                                        Math.min(
                                            referenceNumbers.length - 1,
                                            index + 1
                                        )
                                    );
                                }}
                                disabled={modifying}
                            >
                                <NavigateNext />
                            </Button>
                        </Grid>
                        {/* Last button */}
                        <Grid item>
                            <Button
                                onClick={() => {
                                    load_reference_numbers_list((res) => {
                                        setReferenceNumbers(res.data);
                                        setIndex(res.data.length - 1);
                                    });
                                }}
                                disabled={modifying}
                            >
                                <LastPage />
                            </Button>
                        </Grid>
                        {/* Search reference number field */}
                        <Grid item>
                            <SearchTextField
                                value={referenceSearchField}
                                label="Search"
                                InputProps={{
                                    readOnly: modifying,
                                }}
                                // onSearchButtonClick={() => {}}
                            />
                        </Grid>
                        {/* New button */}
                        <Grid item>
                            <Button
                                disabled={modifying}
                                onClick={() => {
                                    const user_string =
                                        localStorage.getItem("user");
                                    const user = JSON.parse(
                                        user_string ? user_string : ""
                                    );

                                    setModifying(true);
                                    setReferenceNumber("");
                                    setCreditNote({
                                        reference_number: "",
                                        items: [],
                                        amount: 0.0,
                                        vat: 0.0,
                                        total: 0.0,
                                        customer: "",
                                        user: user.username,
                                        credit_number: "",
                                        invoice_number: "",
                                    });
                                    setCustomer("");
                                    setCustomerNumberField("");
                                    setUser(user.username);
                                    setSalespersonUsernameField(user.username);
                                    setSelectedIndex(null);
                                }}
                            >
                                <LibraryAdd />
                                New
                            </Button>
                        </Grid>
                        {/* From Order button */}
                        <Grid item>
                            <Button
                                disabled={modifying}
                                onClick={() => {
                                    setReferenceNumber("");
                                    setSelectedIndex(null);
                                    setOrderSelectModalOpen(true);
                                }}
                            >
                                <PlaylistAddCheck />
                                From Order
                            </Button>
                        </Grid>
                        {/* Modify button */}
                        <Grid item>
                            <Button
                                disabled={modifying}
                                onClick={() => {
                                    setModifying(true);
                                }}
                            >
                                <Edit />
                                Modify
                            </Button>
                        </Grid>
                        {/* Cancel button */}
                        <Grid
                            item
                            sx={{
                                display: modifying ? "block" : "none",
                            }}
                        >
                            <Button
                                onClick={async () => {
                                    setModifying(false);
                                    goToReferenceAtIndex();

                                    setCreditNote(prevCreditNote);
                                }}
                            >
                                <Clear />
                                Cancel
                            </Button>
                        </Grid>
                        {/* Save button */}
                        <Grid
                            item
                            sx={{
                                display: modifying ? "block" : "none",
                            }}
                        >
                            <Button
                                onClick={async () => {
                                    const items = creditNote.items?.filter(
                                        (row) => row.product
                                    );
                                    const csrfToken = await axios
                                        .get(
                                            "http://localhost:8000/csrf_token/"
                                        )
                                        .then(
                                            (response) =>
                                                response.data.csrfToken
                                        )
                                        .catch((error) => console.error(error));
                                    if (referenceNumber) {
                                        axios
                                            .put(
                                                `http://localhost:8000/api/invoices/${referenceNumber}/?expand=items`,
                                                {
                                                    ...creditNote,
                                                    user: user.id,
                                                },
                                                {
                                                    headers: {
                                                        "X-CSRFToken":
                                                            csrfToken,
                                                    },
                                                }
                                            )
                                            .then(() => {
                                                setModifying(false);
                                                setPrevCreditNote({
                                                    ...creditNote,
                                                    items,
                                                });
                                            })
                                            .catch(() => {
                                                setAlertMessage(
                                                    `Could not update quotation ${referenceNumber}.`
                                                );
                                                setAlertSeverity("error");
                                                setAlertVisibility(true);
                                            });
                                    } else {
                                        axios
                                            .post(
                                                `http://localhost:8000/api/invoices/?expand=items`,
                                                {
                                                    ...creditNote,
                                                    user: user.id,
                                                },
                                                {
                                                    headers: {
                                                        "X-CSRFToken":
                                                            csrfToken,
                                                    },
                                                }
                                            )
                                            .then((res) => {
                                                const newReferenceNumber =
                                                    res.data.reference_number;
                                                load_reference_numbers_list(
                                                    (res) => {
                                                        setReferenceNumbers(
                                                            res.data
                                                        );
                                                        setIndex(
                                                            res.data.findIndex(
                                                                (
                                                                    quote: CreditNote
                                                                ) =>
                                                                    quote.reference_number ===
                                                                    newReferenceNumber
                                                            )
                                                        );
                                                    }
                                                );

                                                setModifying(false);
                                            })
                                            .catch(() => {
                                                setAlertMessage(
                                                    `Could not create this new invoice.`
                                                );
                                                setAlertSeverity("error");
                                                setAlertVisibility(true);
                                            });
                                    }
                                }}
                            >
                                <Save />
                                Save
                            </Button>
                        </Grid>
                        <Grid item flexGrow={1}>
                            <Grid container justifyContent="flex-end">
                                {/* Transfer to Order button */}
                                <Grid item>
                                    <Button disabled={modifying}>
                                        <Grading />
                                        Transfer to Order
                                    </Button>
                                </Grid>
                                {/* Print button */}
                                <Grid item>
                                    <Button disabled={modifying}>
                                        <Print />
                                        Print?
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Divider textAlign="left" sx={{ color: "black" }}>
                        Invoice Details
                    </Divider>
                    <Grid container direction="row" spacing={2}>
                        {/* Reference Number field */}
                        <Grid item>
                            <Grid
                                container
                                direction="column"
                                sx={{ width: "auto" }}
                            >
                                {/* Reference Number field */}
                                <SearchTextField
                                    margin="normal"
                                    InputLabelProps={{ shrink: true }}
                                    label="Invoice Reference Number"
                                    value={
                                        invoice.reference_number
                                            ? invoice.reference_number
                                            : ""
                                    }
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                            </Grid>
                        </Grid>
                        {/* Invoice Number field */}
                        <Grid item>
                            <Grid
                                container
                                direction="column"
                                sx={{ width: "auto" }}
                            >
                                {/* Invoice Number field */}
                                <SearchTextField
                                    margin="normal"
                                    InputLabelProps={{ shrink: true }}
                                    label="Invoice Number"
                                    value={
                                        invoice.invoice_number
                                            ? invoice.invoice_number
                                            : ""
                                    }
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                            </Grid>
                        </Grid>
                        {/* Date field */}
                        <Grid item>
                            <Grid
                                container
                                direction="column"
                                sx={{ width: "auto" }}
                            >
                                {/* Date field */}
                                <TextField
                                    margin="normal"
                                    InputLabelProps={{ shrink: true }}
                                    label="Invoice Date"
                                    value={
                                        invoice.created
                                            ? new Date(
                                                  invoice.created
                                              ).toDateString()
                                            : ""
                                    }
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                            </Grid>
                        </Grid>
                        {/* Salesperson Username and Salesperson fields */}
                        <Grid item>
                            <Grid
                                container
                                direction="column"
                                sx={{ width: "auto" }}
                            >
                                {/* Salesperson */}
                                <TextField
                                    margin="normal"
                                    InputLabelProps={{ shrink: true }}
                                    label="Invoice Salesperson"
                                    value={
                                        invoiceUser?.first_name ||
                                        invoiceUser?.last_name
                                            ? `${invoiceUser.first_name} ${invoiceUser.last_name}`
                                            : ""
                                    }
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    sx={{ width: "100%" }}
                                />
                            </Grid>
                        </Grid>
                        {/* Customer Name and Customer Telephone Number fields */}
                        <Grid item>
                            <Grid
                                container
                                direction="column"
                                sx={{ width: "auto" }}
                            >
                                {/* Customer Name field */}
                                <TextField
                                    margin="normal"
                                    InputLabelProps={{ shrink: true }}
                                    label="Customer Name"
                                    value={customer?.name ? customer?.name : ""}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Divider textAlign="left" sx={{ color: "black" }}>
                        Credit Note Details
                    </Divider>
                    <Grid container direction="row" spacing={2}>
                        {/* Reference Number field */}
                        <Grid item>
                            <Grid
                                container
                                direction="column"
                                sx={{ width: "auto" }}
                            >
                                {/* Reference Number field */}
                                <TextField
                                    margin="normal"
                                    InputLabelProps={{ shrink: true }}
                                    label="Reference Number"
                                    value={
                                        creditNote.reference_number
                                            ? creditNote.reference_number
                                            : ""
                                    }
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                            </Grid>
                        </Grid>
                        {/* Date field */}
                        <Grid item>
                            <Grid
                                container
                                direction="column"
                                sx={{ width: "auto" }}
                            >
                                {/* Date field */}
                                <TextField
                                    margin="normal"
                                    InputLabelProps={{ shrink: true }}
                                    label="Date"
                                    value={
                                        creditNote.created
                                            ? new Date(
                                                  creditNote.created
                                              ).toDateString()
                                            : ""
                                    }
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                            </Grid>
                        </Grid>
                        {/* Credit Note Number field */}
                        <Grid item>
                            <Grid
                                container
                                direction="column"
                                sx={{ width: "auto" }}
                            >
                                {/* Credit Note Number */}
                                <TextField
                                    margin="normal"
                                    InputLabelProps={{ shrink: true }}
                                    label="Credit Note Number"
                                    value={creditNote.credit_number}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    sx={{ width: "100%" }}
                                />
                            </Grid>
                        </Grid>
                        {/* Salesperson field */}
                        <Grid item>
                            <Grid
                                container
                                direction="column"
                                sx={{ width: "auto" }}
                            >
                                {/* Salesperson */}
                                <TextField
                                    margin="normal"
                                    InputLabelProps={{ shrink: true }}
                                    label="Salesperson"
                                    value={
                                        user?.first_name && user?.last_name
                                            ? `${user.first_name} ${user.last_name}`
                                            : ""
                                    }
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    sx={{ width: "100%" }}
                                />
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item flexGrow={1} width="100%" height={100}>
                        <SingleClickDataGrid
                            hideFooter
                            columns={quotationColumns}
                            rows={creditNote?.items || []}
                            selectionModel={selectionModel}
                            selectionModelChange={async (newSelection) => {
                                var selectedIndex = creditNote.items?.findIndex(
                                    (item) => item.id === newSelection[0]
                                );
                                selectedIndex = Math.max(
                                    0,
                                    selectedIndex ? selectedIndex : 0
                                );
                                setSelectedIndex(selectedIndex);

                                setSelectionModel(
                                    creditNote.items
                                        ? creditNote.items[selectedIndex].id
                                        : []
                                );
                            }}
                            processRowUpdate={async (newRow, oldRow) => {
                                if (
                                    newRow.product !== "" &&
                                    !_.isEqual(newRow, oldRow)
                                ) {
                                    const quantity = isNaN(newRow.quantity)
                                        ? oldRow.quantity
                                        : newRow.quantity;
                                    if (newRow.product !== oldRow.product) {
                                        if (newRow.product in items) {
                                            const _item = items[newRow.product];
                                            if (
                                                newRow.quantity > _item.quantity
                                            ) {
                                                return oldRow;
                                            }
                                            return {
                                                ...newRow,
                                                description: _item.description,
                                                price: Number(
                                                    _item.price.toFixed(2)
                                                ),
                                            };
                                        } else {
                                            setAlertMessage(
                                                `${newRow.product} was not found in invoice ${invoice.reference_number}.`
                                            );
                                            setAlertSeverity("error");
                                            setAlertVisibility(true);
                                            return oldRow;
                                        }
                                    } else {
                                        const _item = items[newRow.product];
                                        if (newRow.quantity > _item.quantity) {
                                            setAlertMessage(
                                                `Too many ${newRow.product} (${quantity}) is being credited.`
                                            );
                                            setAlertSeverity("error");
                                            setAlertVisibility(true);
                                            return oldRow;
                                        }
                                        const price = isNaN(newRow.price)
                                            ? Number(oldRow.price)
                                            : Number(newRow.price);

                                        if (newRow.price > _item.price) {
                                            setAlertMessage(
                                                `The price of ${newRow.product} (R${price}) is exceeds max invoice price (R${_item.price}).`
                                            );
                                            setAlertSeverity("error");
                                            setAlertVisibility(true);
                                            return oldRow;
                                        }
                                        let subtotal = price * quantity;
                                        const vat = subtotal * 0.15;
                                        subtotal += vat;
                                        const updatedRow = {
                                            ...newRow,
                                            price: price.toFixed(2),
                                            quantity: Number(quantity),
                                            vat: vat.toFixed(2),
                                            subtotal: subtotal.toFixed(2),
                                        };
                                        setCreditNote((prev) => {
                                            const items = prev.items?.map(
                                                (row) =>
                                                    row.id === newRow.id
                                                        ? updatedRow
                                                        : row
                                            );
                                            const totals =
                                                calculateTotals(items);
                                            return {
                                                ...prev,
                                                items: items,
                                                ...totals,
                                            };
                                        });
                                        return updatedRow;
                                    }
                                } else {
                                    return oldRow;
                                }
                            }}
                            processRowUpdateError={(error) => {}}
                        />
                    </Grid>
                    <Grid container flexDirection="row">
                        <Grid item>
                            <Grid
                                container
                                spacing={2}
                                sx={{ marginTop: "5px" }}
                                alignItems="center"
                            >
                                {/* Add button */}
                                <Grid item>
                                    <Button
                                        disabled={!modifying}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setCreditNote(
                                                (prev): CreditNote => {
                                                    return {
                                                        ...prev,
                                                        items: [
                                                            ...prev.items,
                                                            {
                                                                id: crypto.randomUUID(),
                                                                product: "",
                                                                quantity: 0,
                                                                price: 0.0,
                                                                vat: 0.0,
                                                                subtotal: 0.0,
                                                                description: "",
                                                            },
                                                        ],
                                                    };
                                                }
                                            );
                                        }}
                                    >
                                        Add Item
                                    </Button>
                                </Grid>
                                {/* Insert button */}
                                <Grid item>
                                    <Button
                                        disabled={!modifying}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setCreditNote(
                                                (prev): CreditNote => {
                                                    const index = Math.max(
                                                        prev.items.findIndex(
                                                            (obj) =>
                                                                obj.id ===
                                                                selectionModel
                                                        ),
                                                        0
                                                    );

                                                    return {
                                                        ...prev,
                                                        items: [
                                                            ...prev.items.slice(
                                                                0,
                                                                index
                                                            ),
                                                            {
                                                                id: crypto.randomUUID(),
                                                                price: 0,
                                                                vat: 0,
                                                                subtotal: 0,
                                                                quantity: 0,
                                                                product: "",
                                                                description: "",
                                                            },
                                                            ...prev.items.slice(
                                                                index
                                                            ),
                                                        ],
                                                    };
                                                }
                                            );
                                        }}
                                    >
                                        Insert Item
                                    </Button>
                                </Grid>
                                {/* Remove button */}
                                <Grid item>
                                    <Button
                                        disabled={
                                            _.isEqual(selectionModel, []) ||
                                            !modifying
                                        }
                                        onClick={async (e) => {
                                            e.preventDefault();
                                            if (selectedIndex !== null) {
                                                setCreditNote((prev) => {
                                                    const items =
                                                        prev.items?.filter(
                                                            (item, index) =>
                                                                item.id !==
                                                                selectionModel
                                                        );
                                                    const totals =
                                                        calculateTotals(items);
                                                    return {
                                                        ...prev,
                                                        items: items,
                                                        ...totals,
                                                    };
                                                });
                                                setSelectionModel([]);
                                            }
                                        }}
                                    >
                                        Remove Item
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item flexGrow={1}>
                            <Grid
                                container
                                justifyContent="flex-end"
                                spacing={2}
                                sx={{ marginTop: "5px" }}
                            >
                                <Grid item>
                                    <TextField
                                        value={creditNote?.amount}
                                        label="Amount"
                                        InputProps={{
                                            readOnly: true,
                                            inputComponent: CurrencyInput,
                                            inputProps: {
                                                prefix: "R",
                                                defaultValue: 0,
                                                decimalSeparator: ".",
                                                decimalScale: 2,
                                                disableAbbreviations: true,
                                                placeholder: "R",
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item>
                                    <TextField
                                        value={creditNote?.vat}
                                        label="VAT"
                                        InputProps={{
                                            readOnly: true,
                                            inputComponent: CurrencyInput,
                                            inputProps: {
                                                prefix: "R",
                                                defaultValue: 0,
                                                decimalSeparator: ".",
                                                decimalScale: 2,
                                                disableAbbreviations: true,
                                                placeholder: "R",
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item>
                                    <TextField
                                        value={creditNote?.total}
                                        label="Total"
                                        InputProps={{
                                            readOnly: true,
                                            inputComponent: CurrencyInput,
                                            inputProps: {
                                                prefix: "R",
                                                defaultValue: 0,
                                                decimalSeparator: ".",
                                                decimalScale: 2,
                                                disableAbbreviations: true,
                                                placeholder: "R",
                                            },
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
}
