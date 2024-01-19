import { Box, Button, Divider, FormControl, MenuItem, Stack, TextField } from "@mui/material";
import {Add, Save, KeyboardBackspace, Close} from "@mui/icons-material";
import axios from "axios";
import { ChangeEvent, useEffect, useState } from "react";
import Alert from "../common/Alert";
import _ from 'lodash';

export class Customer {    
    name?: string; 
    telephone_number?: string;
    fax_number?: string;
    mobile_number?: string;
    physical_address?: string;
    billing_address?: string;
    vat_number?: string;
    company_key_number?: string;
    credit_limit?: string;
    suspend_date?: string;
    shipping_instructions?: string;
    memo?: string;
    customer_level?: string;
    contact_persons?: [];
}

export interface PriceLevel {
    level_name: string;
    markdown_percentage: string;
}

export default function Customers () {
    const [customerList, setCustomerList] = useState<Customer[]>([]);
    const [customerIndex, setCustomerIndex] = useState<any>('');
    const [pastCustomer, setPastCustomer] = useState<Customer>('');

    const [priceLevelsList, setPriceLevelList] = useState([]);

    const [isAdd, setAdd] = useState(false);
    const [isAlertVisible, setAlertVisibility] = useState(false);
    const [severity, setSeverity] = useState("");
    const [alertMessage, setAlertMessage] = useState("");

    useEffect(() => {
        axios.get("http://localhost:8000/api/customers/")
            .then(res => {
                setCustomerList(res.data);
            })
            .catch(() => {
                setAlertMessage(`Could not retrieve the customers.`);
                setSeverity("error");
                setAlertVisibility(true);})
    }, []);

    useEffect(() => {
        axios.get("http://localhost:8000/api/price_levels/")
            .then(res => setPriceLevelList(res.data))
            .catch(() => {
                setAlertMessage(`Could not retrieve the price levels.`);
                setSeverity("error");
                setAlertVisibility(true);})
    }, []);

    useEffect(() => {
        setPastCustomer(customerList[customerIndex]);
    }, [customerIndex]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setAlertVisibility(false);
        }, 5000);
      
        return () => {
          clearTimeout(timer);
        };
      }, [isAlertVisible]);

    const handleCustomerChange = (event: ChangeEvent<HTMLInputElement>) => {
        setCustomerIndex(event.target.value);
    };

    const handlePriceLevelChange = async (event: ChangeEvent<HTMLInputElement>) => {
        setCustomerList((prevList: Array<Customer>) => {
            const updatedList = prevList.map((item: object, index) => {
            return customerIndex === index ? { ...item, [event.target.name]: event.target.value } : item}
            );
            return updatedList;
        });
    };

    const handleChange = async (event: any) => {
        event.preventDefault();
        setCustomerList((prevList: Array<Customer>) => {
            const updatedList = prevList.map((item: object, index) => {
            return customerIndex === index ? { ...item, [event.target.name]: event.target.value } : item}
            );
            return updatedList;
        });
    };

    const handleAdd = async (event: any) => {
        event.preventDefault();
        setAdd(true);
        setCustomerList([...customerList, new Customer()]);
        setCustomerIndex(customerList.length);
    }

    const handleBack = async (event: any) => {
        event.preventDefault();
        setAdd(false);
        setCustomerList(customerList.slice(0, -1));
        setCustomerIndex("");
    }

    const handleCancel = async (event: any) => {
        event.preventDefault();
        const updatedList = customerList.map((customer: any, index) => {
            return customerIndex === index ? pastCustomer : customer;
        });
        setCustomerList(updatedList);
    }

    const handleSave = async (event: any) => {
        event.preventDefault();
        const csrfToken = await axios.get("http://localhost:8000/csrf_token/")
                                        .then(response => response.data.csrfToken)
                                        .catch(error => console.error(error));
        axios.post("http://localhost:8000/api/update_customer/",
                    customerList[customerIndex],
                    {headers: {"X-CSRFToken": csrfToken}})
                    .then((response) => {
                        setPastCustomer(customerList[customerIndex]);
                        setAlertMessage(`Successfully saved or updated ${customerList[customerIndex].name}.`);
                        setSeverity("success");
                        setAlertVisibility(true);
                    })
                    .catch((error) => {
                        setAlertMessage(`Could not save or update ${customerList[customerIndex].name}.`);
                        setSeverity("error");
                        setAlertVisibility(true);
                    });
    };

    const fieldsDirty = () => {
        return pastCustomer !== '' && !_.isEqual(customerList[customerIndex], pastCustomer);
    }

    return (
        <>
            <Box sx={{
                backgroundColor: "white",
                padding: "20px",}}>
                <Stack 
                    direction="row"
                    justifyContent="space-between"
                >
                    <Button
                        onClick={handleAdd}
                        disabled={fieldsDirty()}
                        sx={{display: isAdd || fieldsDirty() ? "none" : ""}}
                    >
                        <Add />Add
                    </Button>
                    <Button
                        onClick={handleCancel}
                        sx={{display: fieldsDirty() && !isAdd ? "" : "none"}}
                    >
                        <Close />Cancel
                    </Button>
                    <Button
                        onClick={handleBack}
                        sx={{display: isAdd ? "" : "none"}}
                    >
                        <KeyboardBackspace />Back
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={!fieldsDirty()}
                        // sx={{display: fieldsDirty() ? "" : "none"}}
                    >
                        <Save /> {isAdd ? "Save" : "Update"}
                    </Button>
                </Stack>
                <Divider />
                <Stack 
                    direction="row"
                >
                    <FormControl sx={{width: "48%"}}>
                        <TextField
                            select
                            value={customerIndex}
                            margin="normal"
                            onChange={handleCustomerChange}
                            label="Customer"
                            placeholder="Select a customer"
                            disabled={fieldsDirty() || isAdd}
                        >
                            {customerList?.map((customerItem, index)=>(
                                <MenuItem key={index} value={index}>
                                    {customerItem.name}
                                </MenuItem>))}
                        </TextField>
                        <TextField 
                            label="Name"
                            name="name"
                            InputLabelProps={{shrink: true}}
                            value={customerList[customerIndex]?.name}
                            margin="normal"
                            onChange={handleChange} 
                            disabled={customerList[customerIndex] ? false : true} />
                        <TextField 
                            label="Telephone Number"
                            name="telephone_number"
                            InputLabelProps={{shrink: true}}
                            value={customerList[customerIndex]?.telephone_number}
                            margin="normal"
                            onChange={handleChange} 
                            disabled={customerList[customerIndex] ? false : true} />
                        <TextField 
                            label="Fax Number"
                            name="fax_number"
                            InputLabelProps={{shrink: true}}
                            value={customerList[customerIndex]?.fax_number || ""}
                            margin="normal"
                            onChange={handleChange} 
                            disabled={customerList[customerIndex] ? false : true} />
                        <TextField 
                            label="Mobile Number"
                            name="mobile_number"
                            InputLabelProps={{shrink: true}}
                            value={customerList[customerIndex]?.mobile_number}
                            margin="normal"
                            onChange={handleChange} 
                            disabled={customerList[customerIndex] ? false : true} />
                        <TextField 
                            label="Physical Address"
                            name="physical_address"
                            multiline
                            rows={4}
                            InputLabelProps={{shrink: true}}
                            value={customerList[customerIndex]?.physical_address}
                            margin="normal"
                            onChange={handleChange} 
                            disabled={customerList[customerIndex] ? false : true} />
                        <TextField 
                            label="Billing Address"
                            name="billing_address"
                            multiline
                            rows={4}
                            InputLabelProps={{shrink: true}}
                            value={customerList[customerIndex]?.billing_address}
                            margin="normal"
                            onChange={handleChange} 
                            disabled={customerList[customerIndex] ? false : true} />
                        <TextField 
                            label="VAT Number"
                            name="vat_number"
                            InputLabelProps={{shrink: true}}
                            value={customerList[customerIndex]?.vat_number}
                            margin="normal"
                            onChange={handleChange} 
                            disabled={customerList[customerIndex] ? false : true} />
                        <TextField 
                            label="CK Number"
                            name="ck_number"
                            InputLabelProps={{shrink: true}}
                            value={customerList[customerIndex]?.company_key_number}
                            margin="normal"
                            onChange={handleChange} 
                            disabled={customerList[customerIndex] ? false : true} />
                        <Divider />
                        <TextField value={customerList[customerIndex]?.customer_level} sx={{display: "none"}} />
                        <TextField
                            select
                            value={`${customerList[customerIndex]?.customer_level}`}
                            margin="normal"
                            onChange={handlePriceLevelChange}
                            InputLabelProps={{shrink: true}}
                            label="Customer Level"
                            name="customer_level"
                            disabled={customerList[customerIndex] ? false : true}
                        >
                            {priceLevelsList?.map((priceLevel: PriceLevel, index)=>(
                                <MenuItem key={index} value={priceLevel.level_name}>
                                    {priceLevel.level_name} - {parseFloat(priceLevel.markdown_percentage) > 0 ? `(${priceLevel.markdown_percentage})%` : "Original"}
                                </MenuItem>))}
                        </TextField>
                        <TextField 
                            label="Credit Limit"
                            name="credit_limit"
                            InputLabelProps={{shrink: true}}
                            value={customerList[customerIndex]?.credit_limit}
                            margin="normal"
                            onChange={handleChange} 
                            disabled={customerList[customerIndex] ? false : true} />
                        <TextField 
                            label="Suspend Date"
                            name="suspend_date"
                            InputLabelProps={{shrink: true}}
                            value={customerList[customerIndex]?.suspend_date}
                            margin="normal"
                            onChange={handleChange} 
                            disabled={customerList[customerIndex] ? false : true} />
                        <TextField 
                            label="Shipping Instructions"
                            name="shipping_instructions"
                            multiline
                            rows={4}
                            InputLabelProps={{shrink: true}}
                            value={customerList[customerIndex]?.shipping_instructions}
                            margin="normal"
                            onChange={handleChange} 
                            disabled={customerList[customerIndex] ? false : true} />
                        <TextField 
                            label="Memo"
                            name="memo"
                            multiline
                            rows={4}
                            InputLabelProps={{shrink: true}}
                            value={customerList[customerIndex]?.memo}
                            margin="normal"
                            onChange={handleChange} 
                            disabled={customerList[customerIndex] ? false : true} />
                    </FormControl>
                    <Divider 
                        orientation="vertical"
                        flexItem 
                        sx={{marginX: "20px"}}/>
                    <Stack sx={{
                        width: "48%",
                        textAlign: "center"}}>
                        {customerList[customerIndex]?.contact_persons?.map((person: {contact_name: string, role: string}, index) => (
                            <>
                                <Stack>
                                    <TextField
                                        InputLabelProps={{shrink: true}}
                                        key={"contact_name" + index}
                                        value={person.contact_name}
                                        label="Contact Name"
                                        name="contact_name"
                                        margin="normal"
                                        onChange={handleChange}
                                    />
                                    <TextField
                                        InputLabelProps={{shrink: true}}
                                        key={"role" + index}
                                        value={person.role}
                                        label="Role"
                                        name="role"
                                        margin="normal"
                                        onChange={handleChange}
                                    />
                                    <Divider />
                                </Stack>
                            </>))}
                        <Button
                            sx={{margin: "normal"}}
                        >
                            Add Contact Person
                        </Button>
                    </Stack>
                </Stack>                
            </Box>
            {isAlertVisible && <Alert message={alertMessage} severity={severity} onClick={() => setAlertVisibility(false)}/>}
        </>
    );
}