import {
    Box,
    Button,
    Checkbox,
    Divider,
    FormControlLabel,
    Grid,
    MenuItem,
    TextField,
} from "@mui/material";
import {
    Add,
    Save,
    KeyboardBackspace,
    Close,
    PersonRemove,
} from "@mui/icons-material";
import axios from "axios";
import { ChangeEvent, useContext, useEffect, useState } from "react";
import _ from "lodash";
import { AlertContext } from "../../contexts/alertContext";

export interface Customer {
    customer_number: string;
    name: string;
    telephone_number: string;
    fax_number: string;
    mobile_number: string;
    physical_address: string;
    billing_address: string;
    vat_number: string;
    company_key_number: string;
    credit_limit: string;
    suspend: boolean;
    suspend_date: string | null;
    shipping_instructions: string;
    memo: string;
    customer_level: string;
    contact_persons: ContactPerson[];
}

export interface PriceLevel {
    level_name: string;
    markdown_percentage: string;
}

export interface ContactPerson {
    id: string;
    contact_name: string;
    role: string;
    phone_number: string;
    email: string;
}

export default function Customers() {
    const [customerList, setCustomerList] = useState<Customer[]>([]);
    const [customerIndex, setCustomerIndex] = useState<any>("");
    const [pastCustomer, setPastCustomer] = useState<Customer>({
        customer_number: "",
        name: "",
        telephone_number: "",
        fax_number: "",
        mobile_number: "",
        physical_address: "",
        billing_address: "",
        vat_number: "",
        company_key_number: "",
        credit_limit: "",
        suspend: false,
        suspend_date: null,
        shipping_instructions: "",
        memo: "",
        customer_level: "",
        contact_persons: [],
    });
    const [customer, setCustomer] = useState<Customer>({
        customer_number: "",
        name: "",
        telephone_number: "",
        fax_number: "",
        mobile_number: "",
        physical_address: "",
        billing_address: "",
        vat_number: "",
        company_key_number: "",
        credit_limit: "",
        suspend: false,
        suspend_date: null,
        shipping_instructions: "",
        memo: "",
        customer_level: "",
        contact_persons: [],
    });

    const [priceLevelsList, setPriceLevelList] = useState([]);

    const [isAdd, setAdd] = useState(false);

    const { setAlertMessage, setAlertSeverity, setAlertVisibility } =
        useContext(AlertContext);

    const loadCustomerList = () =>
        axios
            .get(
                "http://localhost:8000/api/customers/?only=customer_number,name"
            )
            .then((res) => {
                setCustomerList(res.data);
            })
            .catch(() => {
                setAlertMessage(`Could not retrieve the customers.`);
                setAlertSeverity("error");
                setAlertVisibility(true);
            });

    useEffect(() => {
        loadCustomerList();
    }, []);

    useEffect(() => {
        axios
            .get("http://localhost:8000/api/price_levels/")
            .then((res) => setPriceLevelList(res.data))
            .catch(() => {
                setAlertMessage(`Could not retrieve the price levels.`);
                setAlertSeverity("error");
                setAlertVisibility(true);
            });
    }, []);

    useEffect(() => {
        if (
            customerIndex !== "" &&
            customerList[customerIndex].customer_number
        ) {
            axios
                .get(
                    `http://localhost:8000/api/customers/${customerList[customerIndex].customer_number}/?expand=contact_persons`
                )
                .then((res) => setPastCustomer(res.data))
                .catch(() => {
                    setAlertMessage(
                        `Could not retrieve customer (${customerList[customerIndex].customer_number}).`
                    );
                    setAlertSeverity("error");
                    setAlertVisibility(true);
                });
        }
    }, [customerIndex]);

    useEffect(() => {
        setCustomer(pastCustomer);
    }, [pastCustomer]);

    const handleCustomerChange = (event: ChangeEvent<HTMLInputElement>) => {
        setCustomerIndex(event.target.value);
    };

    const handlePriceLevelChange = async (
        event: ChangeEvent<HTMLInputElement>
    ) => {
        setCustomer((prev) => {
            return { ...prev, [event.target.name]: event.target.value };
        });
    };

    const handleChange = async (event: any) => {
        event.preventDefault();
        setCustomer((prev) => {
            return event.target.name === "customer_number"
                ? {
                      ...prev,
                      [event.target.name]: event.target.value.toUpperCase(),
                  }
                : { ...prev, [event.target.name]: event.target.value };
        });
    };

    const handleAdd = async (event: any) => {
        event.preventDefault();
        setAdd(true);
        setCustomer({
            customer_number: "",
            name: "",
            telephone_number: "",
            fax_number: "",
            mobile_number: "",
            physical_address: "",
            billing_address: "",
            vat_number: "",
            company_key_number: "",
            credit_limit: "",
            suspend: false,
            suspend_date: null,
            shipping_instructions: "",
            memo: "",
            customer_level: "",
            contact_persons: [],
        });
        // setCustomerIndex(customerList.length);
    };

    const handleBack = async (event: any) => {
        event.preventDefault();
        setAdd(false);
        if (customerIndex) {
            axios
                .get(
                    `http://localhost:8000/api/customers/${customerList[customerIndex].customer_number}/?expand=contact_persons`
                )
                .then((res) => setPastCustomer(res.data))
                .catch(() => {
                    setAlertMessage(
                        `Could not retrieve customer (${customerList[customerIndex].customer_number}).`
                    );
                    setAlertSeverity("error");
                    setAlertVisibility(true);
                });
        }
    };

    const handleCancel = async (event: any) => {
        event.preventDefault();
        setCustomer(pastCustomer);
    };

    const handleSave = async (event: any) => {
        event.preventDefault();
        const csrfToken = await axios
            .get("http://localhost:8000/csrf_token/")
            .then((response) => response.data.csrfToken)
            .catch((error) => console.error(error));
        if (isAdd) {
            axios
                .post(
                    `http://localhost:8000/api/customers/?expand=contact_persons`,
                    customer,
                    { headers: { "X-CSRFToken": csrfToken } }
                )
                .then((res) => {
                    setPastCustomer(res.data);
                    setAlertMessage(`Successfully saved ${customer.name}.`);
                    setAlertSeverity("success");
                    setAlertVisibility(true);
                    setAdd(false);
                })
                .catch(() => {
                    setAlertMessage(`Could not save ${customer.name}.`);
                    setAlertSeverity("error");
                    setAlertVisibility(true);
                });
        } else {
            axios
                .patch(
                    `http://localhost:8000/api/customers/${customer.customer_number}/?expand=contact_persons`,
                    customer,
                    { headers: { "X-CSRFToken": csrfToken } }
                )
                .then((res) => {
                    setPastCustomer(res.data);
                    loadCustomerList();
                    setAlertMessage(`Successfully updated ${customer.name}.`);
                    setAlertSeverity("success");
                    setAlertVisibility(true);
                })
                .catch(() => {
                    setAlertMessage(`Could not update ${customer.name}.`);
                    setAlertSeverity("error");
                    setAlertVisibility(true);
                });
        }
    };

    const fieldsDirty = () => {
        return !_.isEqual(customer, {}) && !_.isEqual(customer, pastCustomer);
    };

    const isCustomerEmpty = (customer: Customer) => {
        return _.isEqual(customer, {
            customer_number: "",
            name: "",
            telephone_number: "",
            fax_number: "",
            mobile_number: "",
            physical_address: "",
            billing_address: "",
            vat_number: "",
            company_key_number: "",
            credit_limit: "",
            suspend: false,
            suspend_date: null,
            shipping_instructions: "",
            memo: "",
            customer_level: "",
            contact_persons: [],
        });
    };

    return (
        <>
            <Box
                sx={{
                    backgroundColor: "white",
                    padding: "20px",
                }}
            >
                {/* Buttons Container */}
                <Grid
                    container
                    flexDirection="row"
                    justifyContent="space-between"
                >
                    {!(fieldsDirty() || isAdd) && (
                        <Grid item>
                            <Button onClick={handleAdd}>
                                <Add />
                                Add
                            </Button>
                        </Grid>
                    )}
                    {fieldsDirty() && !isAdd && (
                        <Grid item>
                            <Button onClick={handleCancel}>
                                <Close />
                                Cancel
                            </Button>
                        </Grid>
                    )}
                    {isAdd && (
                        <Grid item>
                            <Button onClick={handleBack}>
                                <KeyboardBackspace />
                                Back
                            </Button>
                        </Grid>
                    )}
                    {fieldsDirty() && (
                        <Grid item>
                            <Button
                                onClick={handleSave}
                                disabled={!fieldsDirty()}
                                // sx={{display: fieldsDirty() ? "" : "none"}}
                            >
                                <Save /> {isAdd ? "Save" : "Update"}
                            </Button>
                        </Grid>
                    )}
                </Grid>

                <Divider />

                <Grid container flexDirection="row">
                    {/* Left Container */}
                    <Grid
                        container
                        flexDirection="column"
                        sx={{ flex: "1 0 auto", maxWidth: "calc(50% - 10px)" }}
                    >
                        {!isAdd && (
                            <Grid item>
                                <TextField
                                    select
                                    value={customerIndex}
                                    margin="normal"
                                    onChange={handleCustomerChange}
                                    label="Customer"
                                    placeholder="Select a customer"
                                    disabled={fieldsDirty() || isAdd}
                                    sx={{ width: "100%" }}
                                >
                                    {customerList?.map(
                                        (customerItem, index) => (
                                            <MenuItem key={index} value={index}>
                                                {customerItem.name}
                                            </MenuItem>
                                        )
                                    )}
                                </TextField>
                            </Grid>
                        )}
                        {isAdd && (
                            <Grid item>
                                <TextField
                                    label="Customer Number"
                                    name="customer_number"
                                    InputLabelProps={{ shrink: true }}
                                    value={
                                        customer ? customer.customer_number : ""
                                    }
                                    margin="normal"
                                    onChange={handleChange}
                                    disabled={isCustomerEmpty(customer)}
                                    sx={{ width: "100%" }}
                                />
                            </Grid>
                        )}
                        <Grid item>
                            <TextField
                                label="Name"
                                name="name"
                                InputLabelProps={{ shrink: true }}
                                value={customer ? customer.name : ""}
                                margin="normal"
                                onChange={handleChange}
                                disabled={isCustomerEmpty(customer)}
                                sx={{ width: "100%" }}
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                                label="Telephone Number"
                                name="telephone_number"
                                InputLabelProps={{ shrink: true }}
                                value={
                                    customer ? customer.telephone_number : ""
                                }
                                margin="normal"
                                onChange={handleChange}
                                disabled={isCustomerEmpty(customer)}
                                sx={{ width: "100%" }}
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                                label="Fax Number"
                                name="fax_number"
                                InputLabelProps={{ shrink: true }}
                                value={customer?.fax_number || ""}
                                margin="normal"
                                onChange={handleChange}
                                disabled={isCustomerEmpty(customer)}
                                sx={{ width: "100%" }}
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                                label="Mobile Number"
                                name="mobile_number"
                                InputLabelProps={{ shrink: true }}
                                value={customer?.mobile_number}
                                margin="normal"
                                onChange={handleChange}
                                disabled={isCustomerEmpty(customer)}
                                sx={{ width: "100%" }}
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                                label="Physical Address"
                                name="physical_address"
                                multiline
                                rows={4}
                                InputLabelProps={{ shrink: true }}
                                value={customer?.physical_address}
                                margin="normal"
                                onChange={handleChange}
                                disabled={isCustomerEmpty(customer)}
                                sx={{ width: "100%" }}
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                                label="Billing Address"
                                name="billing_address"
                                multiline
                                rows={4}
                                InputLabelProps={{ shrink: true }}
                                value={customer?.billing_address}
                                margin="normal"
                                onChange={handleChange}
                                disabled={isCustomerEmpty(customer)}
                                sx={{ width: "100%" }}
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                                label="VAT Number"
                                name="vat_number"
                                InputLabelProps={{ shrink: true }}
                                value={customer ? customer.vat_number : ""}
                                margin="normal"
                                onChange={handleChange}
                                disabled={isCustomerEmpty(customer)}
                                sx={{ width: "100%" }}
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                                label="CK Number"
                                name="ck_number"
                                InputLabelProps={{ shrink: true }}
                                value={customer?.company_key_number}
                                margin="normal"
                                onChange={handleChange}
                                disabled={isCustomerEmpty(customer)}
                                sx={{ width: "100%" }}
                            />
                        </Grid>
                        <Divider />
                        <Grid item>
                            <TextField
                                select
                                value={`${customer.customer_level}`}
                                margin="normal"
                                onChange={handlePriceLevelChange}
                                InputLabelProps={{ shrink: true }}
                                label="Customer Level"
                                name="customer_level"
                                disabled={isCustomerEmpty(customer)}
                                sx={{ width: "100%" }}
                            >
                                {priceLevelsList?.map(
                                    (priceLevel: PriceLevel, index) => (
                                        <MenuItem
                                            key={index}
                                            value={priceLevel.level_name}
                                        >
                                            {priceLevel.level_name} -{" "}
                                            {parseFloat(
                                                priceLevel.markdown_percentage
                                            ) > 0
                                                ? `(${priceLevel.markdown_percentage})%`
                                                : "Original"}
                                        </MenuItem>
                                    )
                                )}
                            </TextField>
                        </Grid>
                        <Grid item>
                            <TextField
                                label="Credit Limit"
                                name="credit_limit"
                                InputLabelProps={{ shrink: true }}
                                value={customer?.credit_limit}
                                margin="normal"
                                onChange={handleChange}
                                disabled={isCustomerEmpty(customer)}
                                sx={{ width: "100%" }}
                            />
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item alignSelf="center">
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            disabled={isCustomerEmpty(customer)}
                                            checked={customer.suspend}
                                            onChange={(event) => {
                                                setCustomer((prev) => {
                                                    return {
                                                        ...prev,
                                                        suspend:
                                                            event.target
                                                                .checked,
                                                        suspend_date: event
                                                            .target.checked
                                                            ? new Date().toISOString()
                                                            : null,
                                                    };
                                                });
                                            }}
                                        />
                                    }
                                    label="Suspended"
                                    sx={{ color: "black" }}
                                    disabled={isCustomerEmpty(customer)}
                                />
                            </Grid>
                            <Grid item flexGrow={1}>
                                <TextField
                                    label="Suspend Date"
                                    name="suspend_date"
                                    InputLabelProps={{ shrink: true }}
                                    value={
                                        customer.suspend_date
                                            ? new Date(
                                                  customer.suspend_date
                                              ).toDateString()
                                            : ""
                                    }
                                    margin="normal"
                                    onChange={handleChange}
                                    disabled={isCustomerEmpty(customer)}
                                    sx={{ width: "100%" }}
                                />
                            </Grid>
                        </Grid>
                        <Grid item>
                            <TextField
                                label="Shipping Instructions"
                                name="shipping_instructions"
                                multiline
                                rows={4}
                                InputLabelProps={{ shrink: true }}
                                value={customer?.shipping_instructions}
                                margin="normal"
                                onChange={handleChange}
                                disabled={isCustomerEmpty(customer)}
                                sx={{ width: "100%" }}
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                                label="Memo"
                                name="memo"
                                multiline
                                rows={4}
                                InputLabelProps={{ shrink: true }}
                                value={customer ? customer.memo : ""}
                                margin="normal"
                                onChange={handleChange}
                                disabled={isCustomerEmpty(customer)}
                                sx={{ width: "100%" }}
                            />
                        </Grid>
                    </Grid>

                    <Divider
                        orientation="vertical"
                        flexItem
                        sx={{ marginX: "20px" }}
                    />

                    {/* Right Container */}
                    <Grid
                        item
                        sx={{ flex: "1 0 auto", maxWidth: "calc(50% - 10px)" }}
                    >
                        <Grid container flexDirection="column">
                            {customer &&
                                customer.contact_persons?.map(
                                    (person: ContactPerson, index) => (
                                        <>
                                            <Grid item alignSelf="end">
                                                <Button
                                                    onClick={(event) => {
                                                        event.preventDefault();
                                                        setCustomer((prev) => ({
                                                            ...prev,
                                                            contact_persons:
                                                                prev.contact_persons.filter(
                                                                    (
                                                                        value,
                                                                        _index
                                                                    ) =>
                                                                        index !==
                                                                        _index
                                                                ),
                                                        }));
                                                    }}
                                                >
                                                    <PersonRemove />
                                                </Button>
                                            </Grid>
                                            <Grid
                                                container
                                                flexDirection="row"
                                                spacing={2}
                                            >
                                                <Grid item flexGrow={1}>
                                                    <TextField
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                        key={
                                                            "contact_name" +
                                                            index
                                                        }
                                                        value={
                                                            person.contact_name
                                                        }
                                                        label="Contact Name"
                                                        name="contact_name"
                                                        margin="normal"
                                                        onChange={(event) => {
                                                            event.preventDefault();
                                                            setCustomer(
                                                                (prev) => ({
                                                                    ...prev,
                                                                    contact_persons:
                                                                        prev.contact_persons.map(
                                                                            (
                                                                                person,
                                                                                _index
                                                                            ) =>
                                                                                index !==
                                                                                _index
                                                                                    ? {
                                                                                          ...person,
                                                                                      }
                                                                                    : {
                                                                                          ...person,
                                                                                          contact_name:
                                                                                              event
                                                                                                  .target
                                                                                                  .value,
                                                                                      }
                                                                        ),
                                                                })
                                                            );
                                                        }}
                                                        sx={{
                                                            width: "100%",
                                                            maxWidth: "100%",
                                                        }}
                                                    />
                                                </Grid>
                                                <Grid item flexGrow={1}>
                                                    <TextField
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                        key={"role" + index}
                                                        value={person.role}
                                                        label="Role"
                                                        name="role"
                                                        margin="normal"
                                                        onChange={(event) => {
                                                            event.preventDefault();
                                                            setCustomer(
                                                                (prev) => ({
                                                                    ...prev,
                                                                    contact_persons:
                                                                        prev.contact_persons.map(
                                                                            (
                                                                                person,
                                                                                _index
                                                                            ) =>
                                                                                index !==
                                                                                _index
                                                                                    ? {
                                                                                          ...person,
                                                                                      }
                                                                                    : {
                                                                                          ...person,
                                                                                          role: event
                                                                                              .target
                                                                                              .value,
                                                                                      }
                                                                        ),
                                                                })
                                                            );
                                                        }}
                                                        sx={{
                                                            width: "100%",
                                                            maxWidth: "100%",
                                                        }}
                                                    />
                                                </Grid>
                                            </Grid>
                                            <Grid
                                                container
                                                flexDirection="row"
                                                spacing={2}
                                            >
                                                <Grid item flexGrow={1}>
                                                    <TextField
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                        key={
                                                            "phone_number" +
                                                            index
                                                        }
                                                        value={
                                                            person.phone_number
                                                        }
                                                        label="Phone Number"
                                                        name="phone_number"
                                                        margin="normal"
                                                        onChange={(event) => {
                                                            event.preventDefault();
                                                            setCustomer(
                                                                (prev) => ({
                                                                    ...prev,
                                                                    contact_persons:
                                                                        prev.contact_persons.map(
                                                                            (
                                                                                person,
                                                                                _index
                                                                            ) =>
                                                                                index !==
                                                                                _index
                                                                                    ? {
                                                                                          ...person,
                                                                                      }
                                                                                    : {
                                                                                          ...person,
                                                                                          phone_number:
                                                                                              event
                                                                                                  .target
                                                                                                  .value,
                                                                                      }
                                                                        ),
                                                                })
                                                            );
                                                        }}
                                                        sx={{
                                                            width: "100%",
                                                            maxWidth: "100%",
                                                        }}
                                                    />
                                                </Grid>
                                                <Grid item flexGrow={1}>
                                                    <TextField
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                        key={"email" + index}
                                                        value={person.email}
                                                        label="Email"
                                                        name="email"
                                                        margin="normal"
                                                        onChange={(event) => {
                                                            event.preventDefault();
                                                            setCustomer(
                                                                (prev) => ({
                                                                    ...prev,
                                                                    contact_persons:
                                                                        prev.contact_persons.map(
                                                                            (
                                                                                person,
                                                                                _index
                                                                            ) =>
                                                                                index !==
                                                                                _index
                                                                                    ? {
                                                                                          ...person,
                                                                                      }
                                                                                    : {
                                                                                          ...person,
                                                                                          email: event
                                                                                              .target
                                                                                              .value,
                                                                                      }
                                                                        ),
                                                                })
                                                            );
                                                        }}
                                                        sx={{
                                                            width: "100%",
                                                            maxWidth: "100%",
                                                        }}
                                                    />
                                                </Grid>
                                            </Grid>
                                            <Divider />
                                        </>
                                    )
                                )}

                            {(!isCustomerEmpty(customer) || isAdd) && (
                                <Grid item>
                                    <Button
                                        sx={{ margin: "normal", width: "100%" }}
                                        onClick={(event) => {
                                            event.preventDefault();
                                            setCustomer((prev) => ({
                                                ...prev,
                                                contact_persons: [
                                                    ...prev.contact_persons,
                                                    {
                                                        id: crypto.randomUUID(),
                                                        contact_name: "",
                                                        role: "",
                                                        phone_number: "",
                                                        email: "",
                                                    },
                                                ],
                                            }));
                                        }}
                                    >
                                        Add Contact Person
                                    </Button>
                                </Grid>
                            )}
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
}
