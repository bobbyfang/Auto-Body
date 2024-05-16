import { useContext, useEffect, useState } from "react";
import Content from "../Content";
import { Box, Button, Divider, Grid, TextField } from "@mui/material";
import axios, { AxiosResponse } from "axios";
import {
    Clear,
    Edit,
    FirstPage,
    Grading,
    LastPage,
    LibraryAdd,
    NavigateBefore,
    NavigateNext,
    Print,
    Save,
} from "@mui/icons-material";
import SearchTextField from "../common/SearchTextField";
import CustomerSelectorModal from "../CustomerSelectorModal";
import { Customer } from "../Customers";
import CurrencyInput from "react-currency-input-field";
import _ from "lodash";
import SingleClickDataGrid from "../common/SingleClickDataGrid";
import { GridInputRowSelectionModel } from "@mui/x-data-grid";
import { ProductPrice } from "../Products";
import { User } from "../common/User";
import ConfirmationDialogue from "../ConfirmationDialogue";
import UserSelectorModal from "../UserSelectorModal";
import { AlertContext } from "../../contexts/alertContext";
import useCustomer from "../../hooks/useCustomer";
import useUser from "../../hooks/useUser";

interface OrderItem {
    id: number | string;
    price: number;
    vat: number;
    subtotal: number;
    quantity: number;
    product: string;
    description: string;
}

export interface Order {
    reference_number: string;
    items: OrderItem[];
    created?: string;
    amount: number;
    vat: number;
    total: number;
    memo?: string;
    user: string;
    customer: string;
}

export default function Quotes() {
    const { setAlertMessage, setAlertVisibility, setAlertSeverity } =
        useContext(AlertContext);

    const [modifying, setModifying] = useState(false);

    const [referenceSearchField, setReferenceSearchField] = useState("");

    const [referenceNumbers, setReferenceNumbers] = useState<Order[]>([]);
    const [index, setIndex] = useState<number>(0);
    const [referenceNumber, setReferenceNumber] = useState("");
    const [prevOrder, setPrevOrder] = useState<Order>({
        reference_number: "",
        items: [],
        amount: 0.0,
        vat: 0.0,
        total: 0.0,
        customer: "",
        user: "",
    });
    const [order, setOrder] = useState<Order>({
        reference_number: "",
        items: [],
        amount: 0.0,
        vat: 0.0,
        total: 0.0,
        customer: "",
        user: "",
    });

    const [isCustomerModalOpen, setCustomerModalOpen] = useState(false);
    const [customerNumberField, setCustomerNumberField] = useState("");
    const { customer, setCustomer } = useCustomer();

    const [isSalesPersonModalOpen, setSalesPersonModalOpen] = useState(false);
    const [salesPersonUsernameField, setSalespersonUsernameField] =
        useState("");
    const [user, setUser] = useUser();

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
            .get("http://localhost:8000/api/orders/?only=reference_number")
            .then(action)
            .catch(() => {
                setAlertMessage(
                    `Could not retrieve list of order reference numbers.`
                );
                setAlertSeverity("error");
                setAlertVisibility(true);
            });
    };

    useEffect(() => {
        load_reference_numbers_list((res) => {
            const orders = res.data;
            setReferenceNumbers(orders);
            setIndex(orders.length - 1);
        });
    }, []);

    const goToReferenceAtIndex = () => {
        if (referenceNumbers.length) {
            setReferenceNumber(referenceNumbers[index].reference_number);
        }
    };

    useEffect(() => {
        goToReferenceAtIndex();
    }, [index]);

    useEffect(() => {
        if (referenceNumber) {
            axios
                .get(
                    `http://localhost:8000/api/orders/${referenceNumber}/?expand=items,user`
                )
                .then((res) => {
                    const order = res.data;
                    setPrevOrder({ ...order, user: order.user.username });
                })
                .catch(() => {
                    setAlertMessage(
                        `Could not load order with reference number ${referenceNumber}.`
                    );
                    setAlertSeverity("error");
                    setAlertVisibility(true);
                });
        }
    }, [referenceNumber]);

    useEffect(() => {
        setOrder(prevOrder);
        setCustomer(prevOrder.customer);
        setUser(prevOrder.user);
        setSelectionModel([]);
    }, [prevOrder]);

    useEffect(() => {
        setCustomerNumberField(customer.customer_number);
        setOrder((prev): Order => {
            return { ...prev, customer: customer.customer_number };
        });
    }, [customer]);

    useEffect(() => {
        setSalespersonUsernameField(user.username);
        setOrder((prev): Order => {
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

    const calculateTotals = (items: OrderItem[]) => {
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
            amount: totals.amount.toFixed(2),
            vat: totals.amount.toFixed(2),
            total: totals.total.toFixed(2),
        };
    };

    return (
        <>
            <UserSelectorModal
                open={isSalesPersonModalOpen}
                setOpen={setSalesPersonModalOpen}
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
                                    setCustomer("");
                                    setUser(user.username);
                                    setSelectedIndex(null);
                                    setOrder({
                                        reference_number: "",
                                        items: [],
                                        amount: 0.0,
                                        vat: 0.0,
                                        total: 0.0,
                                        customer: "",
                                        user: user.username,
                                    });
                                }}
                            >
                                <LibraryAdd />
                                New
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

                                    setOrder(prevOrder);
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
                                    const items = order.items?.filter(
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
                                                `http://localhost:8000/api/orders/${referenceNumber}/`,
                                                {
                                                    ...order,
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
                                                setPrevOrder({
                                                    ...order,
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
                                                `http://localhost:8000/api/orders/`,
                                                {
                                                    ...order,
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
                                                                    quote: Order
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
                                                    `Could not create this new quotation.`
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
                    <Divider />
                    <Grid container direction="row" spacing={2}>
                        {/* Reference Number and Date fields */}
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
                                        order.reference_number
                                            ? order.reference_number
                                            : ""
                                    }
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                                {/* Date field */}
                                <TextField
                                    margin="normal"
                                    InputLabelProps={{ shrink: true }}
                                    label="Date"
                                    value={
                                        order.created
                                            ? new Date(
                                                  order.created
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
                                {/* Salesperson Username */}
                                <SearchTextField
                                    label="Salesperson Username"
                                    value={salesPersonUsernameField}
                                    onSearchButtonClick={() => {
                                        setSalesPersonModalOpen(true);
                                    }}
                                    onChange={(event) => {
                                        setSalespersonUsernameField(
                                            event.target.value
                                        );
                                    }}
                                    onKeyUp={(event) => {
                                        if (
                                            salesPersonUsernameField &&
                                            modifying &&
                                            event.key === "Enter"
                                        ) {
                                            setUser(salesPersonUsernameField);
                                        }
                                    }}
                                    InputProps={{
                                        readOnly: !modifying,
                                    }}
                                />
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
                        {/* Customer Number and Customer Level fields */}
                        <Grid item>
                            <Grid
                                container
                                direction="column"
                                sx={{ width: "auto" }}
                            >
                                {/* Customer Number field */}
                                <SearchTextField
                                    label="Customer Number"
                                    value={customerNumberField}
                                    onSearchButtonClick={() => {
                                        setCustomerModalOpen(true);
                                    }}
                                    onChange={(event) => {
                                        setCustomerNumberField(
                                            event.target.value.toUpperCase()
                                        );
                                    }}
                                    onKeyUp={(event) => {
                                        if (
                                            customerNumberField &&
                                            modifying &&
                                            event.key === "Enter"
                                        ) {
                                            setCustomer(customerNumberField);
                                        }
                                    }}
                                    InputProps={{
                                        readOnly: !modifying,
                                    }}
                                />
                                {/* Customer Level field */}
                                <TextField
                                    margin="normal"
                                    InputLabelProps={{ shrink: true }}
                                    label="Customer Level"
                                    value={
                                        customer?.customer_level
                                            ? customer?.customer_level
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
                                {/* Customer Telephone Number field */}
                                <TextField
                                    margin="normal"
                                    InputLabelProps={{ shrink: true }}
                                    label="Telephone Number"
                                    value={
                                        customer?.telephone_number
                                            ? customer?.telephone_number
                                            : ""
                                    }
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                            </Grid>
                        </Grid>
                        {/* Customer Physical Address field */}
                        <Grid item>
                            <TextField
                                margin="normal"
                                InputLabelProps={{ shrink: true }}
                                label="Physical Address"
                                value={
                                    customer?.physical_address
                                        ? customer?.physical_address
                                        : ""
                                }
                                multiline
                                InputProps={{
                                    style: {
                                        height: "135px",
                                    },
                                    readOnly: true,
                                }}
                            />
                        </Grid>
                    </Grid>

                    <Grid item flexGrow={1} width="100%" height={100}>
                        <SingleClickDataGrid
                            hideFooter
                            columns={quotationColumns}
                            rows={order?.items || []}
                            selectionModel={selectionModel}
                            selectionModelChange={async (newSelection) => {
                                var selectedIndex = order.items?.findIndex(
                                    (item) => item.id === newSelection[0]
                                );
                                selectedIndex = Math.max(
                                    0,
                                    selectedIndex ? selectedIndex : 0
                                );
                                setSelectedIndex(selectedIndex);

                                setSelectionModel(
                                    order.items
                                        ? order.items[selectedIndex].id
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
                                        try {
                                            const product_details =
                                                await getProductDetails(
                                                    newRow.product
                                                )
                                                    .then((res) => res.data)
                                                    .catch(() => {
                                                        setAlertMessage(
                                                            `Could not retrieve product data for ${newRow.product}.`
                                                        );
                                                        setAlertSeverity(
                                                            "error"
                                                        );
                                                        setAlertVisibility(
                                                            true
                                                        );
                                                    });
                                            const priceObject =
                                                product_details.prices.filter(
                                                    (price: ProductPrice) =>
                                                        price.level ==
                                                        customer?.customer_level
                                                );
                                            if (priceObject.length > 1) {
                                                throw new Error(
                                                    "More than 1 price."
                                                );
                                            }
                                            const price = Number(
                                                priceObject[0].price
                                            );
                                            let subtotal = price * quantity;
                                            const vat = subtotal * 0.15;
                                            subtotal += vat;
                                            const updatedRow = {
                                                ...newRow,
                                                description: `${product_details.description} ${product_details.model} ${product_details.year}`,
                                                price: price,
                                                quantity: Number(quantity),
                                                vat: vat.toFixed(2),
                                                subtotal: subtotal.toFixed(2),
                                            };
                                            setOrder((prev): Order => {
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
                                                    // product: product
                                                    items: items,
                                                    ...totals,
                                                };
                                            });
                                            return updatedRow;
                                        } catch {
                                            return oldRow;
                                        }
                                    } else {
                                        const price = isNaN(newRow.price)
                                            ? Number(oldRow.price)
                                            : Number(newRow.price);
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
                                        setOrder((prev) => {
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
                                            setOrder((prev): Order => {
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
                                            });
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
                                            setOrder((prev): Order => {
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
                                            });
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
                                                setOrder((prev) => {
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
                                        value={order?.amount}
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
                                        value={order?.vat}
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
                                        value={order?.total}
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
