import { useEffect, useState } from "react";
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

interface OrderItem {
    id: number | string;
    price: number;
    vat: number;
    subtotal: number;
    quantity: number;
    product: string;
    description: string;
}

interface Order {
    reference_number?: string;
    items: OrderItem[];
    created?: string;
    amount: number;
    vat: number;
    total: number;
    memo?: string;
    user?: string;
    customer?: string;
}

export default function Quotes() {
    const [isAlertVisible, setAlertVisibility] = useState(false);
    const [severity, setSeverity] = useState("");
    const [alertMessage, setAlertMessage] = useState("");

    const [modifying, setModifying] = useState(false);

    const [referenceSearchField, setReferenceSearchField] = useState("");

    const [referenceNumbers, setReferenceNumbers] = useState<Order[]>([]);
    const [index, setIndex] = useState<number>(0);
    const [referenceNumber, setReferenceNumber] = useState("");
    const [prevQuotation, setPrevQuotation] = useState<Order>({
        items: [],
        amount: 0.0,
        vat: 0.0,
        total: 0.0,
    });
    const [quotation, setQuotation] = useState<Order>({
        items: [],
        amount: 0.0,
        vat: 0.0,
        total: 0.0,
    });

    const [isCustomerModalOpen, setCustomerModalOpen] = useState(false);
    const [customerNumberField, setCustomerNumberField] = useState("");
    const [customer, setCustomer] = useState<Customer | null>(null);

    const [isSalesPersonModalOpen, setSalesPersonModalOpen] = useState(false);
    const [salesPersonUsernameField, setSalesPersonUsernameField] =
        useState("");
    const [salesPerson, setSalesPerson] = useState<User>({});

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
            .get("http://localhost:8000/api/orders_list/")
            .then(action)
            .catch(() => {
                setAlertMessage(
                    `Could not retrieve list of order reference numbers.`
                );
                setSeverity("error");
                setAlertVisibility(true);
            });
    };

    useEffect(() => {
        load_reference_numbers_list((res) => {
            setReferenceNumbers(res.data);
            setIndex(res.data.length - 1);
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

    const getSalesPerson = (username: string) => {
        axios
            .get(`http://localhost:8000/api/users/${username}`)
            .then((res) => {
                setSalesPerson(res.data);
                setSalesPersonUsernameField(username);
            })
            .catch(() => {
                setAlertMessage(
                    `Could not find salesperson with username "${username}".`
                );
                setSeverity("error");
                setAlertVisibility(true);
            });
    };

    useEffect(() => {
        if (referenceNumber) {
            axios
                .get(`http://localhost:8000/api/orders/${referenceNumber}`)
                .then((res) => {
                    setPrevQuotation(res.data);
                    getSalesPerson(res.data.user);
                })
                .catch(() => {
                    setAlertMessage(
                        `Could not load order with reference number ${referenceNumber}.`
                    );
                    setSeverity("error");
                    setAlertVisibility(true);
                });
        }
    }, [referenceNumber]);

    useEffect(() => {
        setQuotation(prevQuotation);
        setSelectionModel([]);
    }, [prevQuotation]);

    useEffect(() => {
        if (!_.isEqual(quotation, {})) {
            getCustomer(quotation.customer ? quotation.customer : "");
        }
    }, [quotation]);

    const getCustomer = (customer_number: string) => {
        if (customer_number) {
            axios
                .get(`http://localhost:8000/api/customers/${customer_number}/`)
                .then((res) => {
                    setCustomer(res.data);
                    // setCustomerNumberField(res.data.customer_number);
                    if (customer_number != quotation.customer) {
                        setQuotation((prev): Order => {
                            return { ...prev, customer: customer_number };
                        });
                    }
                })
                .catch(() => {
                    setAlertMessage(
                        `Customer with number "${customer_number}" was not found.`
                    );
                    setSeverity("error");
                    setAlertVisibility(true);
                });
        }
    };

    useEffect(() => {
        setCustomerNumberField(customer?.customer_number);
    }, [customer]);

    useEffect(() => {
        setSalesPersonUsernameField(salesPerson.username);
    }, [salesPerson]);

    useEffect(() => {
        if (!modifying) {
            setCustomerNumberField(
                customer?.customer_number ? customer?.customer_number : ""
            );
            setSalesPersonUsernameField(
                salesPerson?.username ? salesPerson?.username : ""
            );
            setSelectionModel([]);
        }
    }, [modifying]);

    const getProductDetails = async (productID: string) => {
        const a = axios.get(`http://localhost:8000/api/products/${productID}/`);
        return a;
    };

    const calculateTotals = (items: OrderItem[]) => {
        return items.reduce(
            (prev, cur) => {
                return {
                    amount: prev.amount + Number(cur.price) * cur.quantity,
                    vat: prev.vat + Number(cur.vat),
                    total: prev.total + Number(cur.subtotal),
                };
            },
            { amount: 0.0, vat: 0.0, total: 0.0 }
        );
    };

    return (
        <>
            <Content
                isAlertVisible={isAlertVisible}
                setAlertVisibility={setAlertVisibility}
                alertMessage={alertMessage}
                severity={severity}
            >
                <CustomerSelectorModal
                    open={isCustomerModalOpen}
                    setOpen={setCustomerModalOpen}
                    setAlertMessage={setAlertMessage}
                    setAlertVisibility={setAlertVisibility}
                    setSeverity={setAlertVisibility}
                    setFunction={undefined}
                />
                <CustomerSelectorModal
                    open={isSalesPersonModalOpen}
                    setOpen={setSalesPersonModalOpen}
                    setAlertMessage={setAlertMessage}
                    setAlertVisibility={setAlertVisibility}
                    setSeverity={setAlertVisibility}
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
                                        setQuotation({
                                            items: [],
                                            amount: 0.0,
                                            vat: 0.0,
                                            total: 0.0,
                                        });
                                        setCustomer({});
                                        setCustomerNumberField("");
                                        setSalesPerson(user);
                                        setSalesPersonUsernameField(
                                            user.username
                                        );
                                        setSelectedIndex(null);
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

                                        setQuotation(prevQuotation);
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
                                        const items = quotation.items?.filter(
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
                                            .catch((error) =>
                                                console.error(error)
                                            );
                                        if (referenceNumber) {
                                            axios
                                                .put(
                                                    `http://localhost:8000/api/orders/${referenceNumber}/`,
                                                    {
                                                        ...quotation,
                                                        items,
                                                        user: salesPerson.username,
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
                                                    setPrevQuotation({
                                                        ...quotation,
                                                        items,
                                                    });
                                                })
                                                .catch(() => {
                                                    setAlertMessage(
                                                        `Could not update quotation ${referenceNumber}.`
                                                    );
                                                    setSeverity("error");
                                                    setAlertVisibility(true);
                                                });
                                        } else {
                                            axios
                                                .post(
                                                    `http://localhost:8000/api/orders/`,
                                                    {
                                                        ...quotation,
                                                        items,
                                                        user: salesPerson.username,
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
                                                        res.data
                                                            .reference_number;
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
                                                    setSeverity("error");
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
                                            quotation.reference_number
                                                ? quotation.reference_number
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
                                            quotation.created
                                                ? new Date(
                                                      quotation.created
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
                                            setSalesPersonUsernameField(
                                                event.target.value
                                            );
                                        }}
                                        onKeyUp={(event) => {
                                            if (
                                                salesPersonUsernameField &&
                                                modifying &&
                                                event.key === "Enter"
                                            ) {
                                                getSalesPerson(
                                                    salesPersonUsernameField
                                                );
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
                                            salesPerson?.first_name &&
                                            salesPerson?.last_name
                                                ? `${salesPerson.first_name} ${salesPerson.last_name}`
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
                                                getCustomer(
                                                    customerNumberField
                                                );
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
                                        value={
                                            customer?.name ? customer?.name : ""
                                        }
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
                                rows={quotation?.items || []}
                                selectionModel={selectionModel}
                                selectionModelChange={async (newSelection) => {
                                    var selectedIndex =
                                        quotation.items?.findIndex(
                                            (item) =>
                                                item.id === newSelection[0]
                                        );
                                    selectedIndex = Math.max(
                                        0,
                                        selectedIndex ? selectedIndex : 0
                                    );
                                    setSelectedIndex(selectedIndex);

                                    setSelectionModel(
                                        quotation.items
                                            ? quotation.items[selectedIndex].id
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
                                                            setSeverity(
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
                                                    subtotal:
                                                        subtotal.toFixed(2),
                                                };
                                                setQuotation((prev): Order => {
                                                    const items =
                                                        prev.items?.map((row) =>
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
                                            setQuotation((prev) => {
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
                                                setQuotation((prev): Order => {
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
                                                setQuotation((prev): Order => {
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
                                                    setQuotation((prev) => {
                                                        const items =
                                                            prev.items?.filter(
                                                                (item, index) =>
                                                                    item.id !==
                                                                    selectionModel
                                                            );
                                                        const totals =
                                                            calculateTotals(
                                                                items
                                                            );
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
                                            value={quotation?.amount}
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
                                            value={quotation?.vat}
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
                                            value={quotation?.total}
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
            </Content>
        </>
    );
}
