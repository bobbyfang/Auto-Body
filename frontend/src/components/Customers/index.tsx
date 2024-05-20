import {
    Box,
    Button,
    Divider,
    Grid,
    MenuItem,
    Stack,
    TextField,
} from "@mui/material";
import { Add, Save, KeyboardBackspace, Close } from "@mui/icons-material";
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
    suspend_date: string;
    shipping_instructions: string;
    memo: string;
    customer_level: string;
    contact_persons: [];
}

export interface PriceLevel {
    level_name: string;
    markdown_percentage: string;
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
        suspend_date: "",
        shipping_instructions: "",
        memo: "",
        customer_level: "",
        contact_persons: [],
    });

    const [priceLevelsList, setPriceLevelList] = useState([]);

    const [isAdd, setAdd] = useState(false);

    const { setAlertMessage, setAlertSeverity, setAlertVisibility } =
        useContext(AlertContext);

    useEffect(() => {
        axios
            .get("http://localhost:8000/api/customers/?expand=contact_persons")
            .then((res) => {
                setCustomerList(res.data);
            })
            .catch(() => {
                setAlertMessage(`Could not retrieve the customers.`);
                setAlertSeverity("error");
                setAlertVisibility(true);
            });
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
        setPastCustomer(customerList[customerIndex]);
    }, [customerIndex]);

    const handleCustomerChange = (event: ChangeEvent<HTMLInputElement>) => {
        setCustomerIndex(event.target.value);
    };

    const handlePriceLevelChange = async (
        event: ChangeEvent<HTMLInputElement>
    ) => {
        setCustomerList((prevList: Array<Customer>) => {
            const updatedList = prevList.map((item: Customer, index) => {
                return customerIndex === index
                    ? { ...item, [event.target.name]: event.target.value }
                    : item;
            });
            return updatedList;
        });
    };

    const handleChange = async (event: any) => {
        event.preventDefault();
        setCustomerList((prevList: Array<Customer>) => {
            const updatedList = prevList.map((item: Customer, index) => {
                return customerIndex === index
                    ? { ...item, [event.target.name]: event.target.value }
                    : item;
            });
            return updatedList;
        });
    };

    const handleAdd = async (event: any) => {
        event.preventDefault();
        setAdd(true);
        setCustomerList([
            ...customerList,
            {
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
                suspend_date: "",
                shipping_instructions: "",
                memo: "",
                customer_level: "",
                contact_persons: [],
            },
        ]);
        setCustomerIndex(customerList.length);
    };

    const handleBack = async (event: any) => {
        event.preventDefault();
        setAdd(false);
        setCustomerList(customerList.slice(0, -1));
        setCustomerIndex("");
    };

    const handleCancel = async (event: any) => {
        event.preventDefault();
        const updatedList = customerList.map((customer: any, index) => {
            return customerIndex === index ? pastCustomer : customer;
        });
        setCustomerList(updatedList);
    };

    const handleSave = async (event: any) => {
        event.preventDefault();
        const csrfToken = await axios
            .get("http://localhost:8000/csrf_token/")
            .then((response) => response.data.csrfToken)
            .catch((error) => console.error(error));
        axios
            .post(
                "http://localhost:8000/api/update_customer/",
                customerList[customerIndex],
                { headers: { "X-CSRFToken": csrfToken } }
            )
            .then(() => {
                setPastCustomer(customerList[customerIndex]);
                setAlertMessage(
                    `Successfully saved or updated ${customerList[customerIndex].name}.`
                );
                setAlertSeverity("success");
                setAlertVisibility(true);
            })
            .catch(() => {
                setAlertMessage(
                    `Could not save or update ${customerList[customerIndex].name}.`
                );
                setAlertSeverity("error");
                setAlertVisibility(true);
            });
    };

    const fieldsDirty = () => {
        return (
            !_.isEqual(pastCustomer, {}) &&
            !_.isEqual(customerList[customerIndex], pastCustomer)
        );
    };

    return (
        <>
            <Box
                sx={{
                    backgroundColor: "white",
                    padding: "20px",
                }}
            >
                <Grid
                    container
                    flexDirection="row"
                    justifyContent="space-between"
                >
                    <Grid item>
                        <Button
                            onClick={handleAdd}
                            disabled={fieldsDirty()}
                            sx={{
                                display: isAdd || fieldsDirty() ? "none" : "",
                            }}
                        >
                            <Add />
                            Add
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button
                            onClick={handleCancel}
                            sx={{
                                display: fieldsDirty() && !isAdd ? "" : "none",
                            }}
                        >
                            <Close />
                            Cancel
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button
                            onClick={handleBack}
                            sx={{ display: isAdd ? "" : "none" }}
                        >
                            <KeyboardBackspace />
                            Back
                        </Button>
                    </Grid>
                    {isAdd && !fieldsDirty() && (
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
                <Grid
                    container
                    flexDirection="row"
                    // justifyContent="space-between"
                >
                    <Grid
                        item
                        sx={{ flex: "1 0 auto", maxWidth: "calc(50% - 10px)" }}
                    >
                        <Grid container flexDirection="column">
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
                            <Grid item>
                                <TextField
                                    label="Name"
                                    name="name"
                                    InputLabelProps={{ shrink: true }}
                                    value={
                                        customerList[customerIndex]
                                            ? customerList[customerIndex].name
                                            : ""
                                    }
                                    margin="normal"
                                    onChange={handleChange}
                                    disabled={
                                        customerList[customerIndex]
                                            ? false
                                            : true
                                    }
                                    sx={{ width: "100%" }}
                                />
                            </Grid>
                            <Grid item>
                                <TextField
                                    label="Telephone Number"
                                    name="telephone_number"
                                    InputLabelProps={{ shrink: true }}
                                    value={
                                        customerList[customerIndex]
                                            ? customerList[customerIndex]
                                                  .telephone_number
                                            : ""
                                    }
                                    margin="normal"
                                    onChange={handleChange}
                                    disabled={
                                        customerList[customerIndex]
                                            ? false
                                            : true
                                    }
                                    sx={{ width: "100%" }}
                                />
                            </Grid>
                            <Grid item>
                                <TextField
                                    label="Fax Number"
                                    name="fax_number"
                                    InputLabelProps={{ shrink: true }}
                                    value={
                                        customerList[customerIndex]
                                            ?.fax_number || ""
                                    }
                                    margin="normal"
                                    onChange={handleChange}
                                    disabled={
                                        customerList[customerIndex]
                                            ? false
                                            : true
                                    }
                                    sx={{ width: "100%" }}
                                />
                            </Grid>
                            <Grid item>
                                <TextField
                                    label="Mobile Number"
                                    name="mobile_number"
                                    InputLabelProps={{ shrink: true }}
                                    value={
                                        customerList[customerIndex]
                                            ?.mobile_number
                                    }
                                    margin="normal"
                                    onChange={handleChange}
                                    disabled={
                                        customerList[customerIndex]
                                            ? false
                                            : true
                                    }
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
                                    value={
                                        customerList[customerIndex]
                                            ?.physical_address
                                    }
                                    margin="normal"
                                    onChange={handleChange}
                                    disabled={
                                        customerList[customerIndex]
                                            ? false
                                            : true
                                    }
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
                                    value={
                                        customerList[customerIndex]
                                            ?.billing_address
                                    }
                                    margin="normal"
                                    onChange={handleChange}
                                    disabled={
                                        customerList[customerIndex]
                                            ? false
                                            : true
                                    }
                                    sx={{ width: "100%" }}
                                />
                            </Grid>
                            <Grid item>
                                <TextField
                                    label="VAT Number"
                                    name="vat_number"
                                    InputLabelProps={{ shrink: true }}
                                    value={
                                        customerList[customerIndex]
                                            ? customerList[customerIndex]
                                                  .vat_number
                                            : ""
                                    }
                                    margin="normal"
                                    onChange={handleChange}
                                    disabled={
                                        customerList[customerIndex]
                                            ? false
                                            : true
                                    }
                                    sx={{ width: "100%" }}
                                />
                            </Grid>
                            <Grid item>
                                <TextField
                                    label="CK Number"
                                    name="ck_number"
                                    InputLabelProps={{ shrink: true }}
                                    value={
                                        customerList[customerIndex]
                                            ?.company_key_number
                                    }
                                    margin="normal"
                                    onChange={handleChange}
                                    disabled={
                                        customerList[customerIndex]
                                            ? false
                                            : true
                                    }
                                    sx={{ width: "100%" }}
                                />
                            </Grid>
                            <Divider />
                            {/* <Grid item>
                            <TextField
                                value={
                                    customerList[customerIndex].customer_level
                                }
                                sx={{ display: "none" }}
                            />
                        </Grid> */}
                            <Grid item>
                                {/* <TextField
                                    select
                                    value={`${customerList[customerIndex].customer_level}`}
                                    margin="normal"
                                    onChange={handlePriceLevelChange}
                                    InputLabelProps={{ shrink: true }}
                                    label="Customer Level"
                                    name="customer_level"
                                    disabled={
                                        customerList[customerIndex]
                                            ? false
                                            : true
                                    }
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
                                </TextField> */}
                            </Grid>
                            <Grid item>
                                <TextField
                                    label="Credit Limit"
                                    name="credit_limit"
                                    InputLabelProps={{ shrink: true }}
                                    value={
                                        customerList[customerIndex]
                                            ?.credit_limit
                                    }
                                    margin="normal"
                                    onChange={handleChange}
                                    disabled={
                                        customerList[customerIndex]
                                            ? false
                                            : true
                                    }
                                    sx={{ width: "100%" }}
                                />
                            </Grid>
                            <Grid item>
                                <TextField
                                    label="Suspend Date"
                                    name="suspend_date"
                                    InputLabelProps={{ shrink: true }}
                                    value={
                                        customerList[customerIndex]
                                            ?.suspend_date
                                    }
                                    margin="normal"
                                    onChange={handleChange}
                                    disabled={
                                        customerList[customerIndex]
                                            ? false
                                            : true
                                    }
                                    sx={{ width: "100%" }}
                                />
                            </Grid>
                            <Grid item>
                                <TextField
                                    label="Shipping Instructions"
                                    name="shipping_instructions"
                                    multiline
                                    rows={4}
                                    InputLabelProps={{ shrink: true }}
                                    value={
                                        customerList[customerIndex]
                                            ?.shipping_instructions
                                    }
                                    margin="normal"
                                    onChange={handleChange}
                                    disabled={
                                        customerList[customerIndex]
                                            ? false
                                            : true
                                    }
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
                                    value={
                                        customerList[customerIndex]
                                            ? customerList[customerIndex].memo
                                            : ""
                                    }
                                    margin="normal"
                                    onChange={handleChange}
                                    disabled={
                                        customerList[customerIndex]
                                            ? false
                                            : true
                                    }
                                    sx={{ width: "100%" }}
                                />
                            </Grid>
                            {/* </FormControl> */}
                        </Grid>
                    </Grid>

                    <Divider
                        orientation="vertical"
                        flexItem
                        sx={{ marginX: "20px" }}
                    />

                    <Grid
                        item
                        sx={{ flex: "1 0 auto", maxWidth: "calc(50% - 10px)" }}
                    >
                        <Grid container flexDirection="column">
                            <Grid item>
                                <Button sx={{ margin: "normal" }}>
                                    Add Contact Person
                                </Button>
                            </Grid>
                            {customerList[customerIndex] &&
                                customerList[
                                    customerIndex
                                ].contact_persons?.map(
                                    (
                                        person: {
                                            contact_name: string;
                                            role: string;
                                        },
                                        index
                                    ) => (
                                        <Grid item>
                                            <Stack>
                                                <TextField
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                    key={"contact_name" + index}
                                                    value={person.contact_name}
                                                    label="Contact Name"
                                                    name="contact_name"
                                                    margin="normal"
                                                    onChange={handleChange}
                                                />
                                                <TextField
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                    key={"role" + index}
                                                    value={person.role}
                                                    label="Role"
                                                    name="role"
                                                    margin="normal"
                                                    onChange={handleChange}
                                                />
                                                <Divider />
                                            </Stack>
                                        </Grid>
                                    )
                                )}
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
}
