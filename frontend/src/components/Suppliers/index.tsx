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

export interface Supplier {
    supplier_number: string;
    name: string;
    telephone_number: string;
    fax_number: string;
    mobile_number: string;
    physical_address: string;
    billing_address: string;
    vat_number: string;
    company_key_number: string;
    memo: string;
    contact_persons: ContactPerson[];
}

export interface ContactPerson {
    id: string;
    contact_name: string;
    role: string;
    phone_number: string;
    email: string;
}

export default function Suppliers() {
    const [supplierList, setSupplierList] = useState<Supplier[]>([]);
    const [supplierIndex, setSupplierIndex] = useState<any>("");
    const [pastSupplier, setPastSupplier] = useState<Supplier>({
        supplier_number: "",
        name: "",
        telephone_number: "",
        fax_number: "",
        mobile_number: "",
        physical_address: "",
        billing_address: "",
        vat_number: "",
        company_key_number: "",
        memo: "",
        contact_persons: [],
    });
    const [supplier, setSupplier] = useState<Supplier>({
        supplier_number: "",
        name: "",
        telephone_number: "",
        fax_number: "",
        mobile_number: "",
        physical_address: "",
        billing_address: "",
        vat_number: "",
        company_key_number: "",
        memo: "",
        contact_persons: [],
    });

    const [isAdd, setAdd] = useState(false);

    const { setAlertMessage, setAlertSeverity, setAlertVisibility } =
        useContext(AlertContext);

    const loadSupplierList = () =>
        axios
            .get(
                "http://localhost:8000/api/suppliers/?only=supplier_number,name"
            )
            .then((res) => {
                setSupplierList(res.data);
            })
            .catch(() => {
                setAlertMessage(`Could not retrieve the suppliers.`);
                setAlertSeverity("error");
                setAlertVisibility(true);
            });

    useEffect(() => {
        loadSupplierList();
    }, []);

    useEffect(() => {
        if (
            supplierIndex !== "" &&
            supplierList[supplierIndex].supplier_number
        ) {
            axios
                .get(
                    `http://localhost:8000/api/suppliers/${supplierList[supplierIndex].supplier_number}/?expand=contact_persons`
                )
                .then((res) => setPastSupplier(res.data))
                .catch(() => {
                    setAlertMessage(
                        `Could not retrieve supplier (${supplierList[supplierIndex].supplier_number}).`
                    );
                    setAlertSeverity("error");
                    setAlertVisibility(true);
                });
        } else {
            setPastSupplier({
                supplier_number: "",
                name: "",
                telephone_number: "",
                fax_number: "",
                mobile_number: "",
                physical_address: "",
                billing_address: "",
                vat_number: "",
                company_key_number: "",
                memo: "",
                contact_persons: [],
            });
        }
    }, [supplierIndex]);

    useEffect(() => {
        setSupplier(pastSupplier);
    }, [pastSupplier]);

    const handleSupplierChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSupplierIndex(event.target.value);
    };

    const handleChange = async (event: any) => {
        event.preventDefault();
        setSupplier((prev) => {
            return event.target.name === "supplier_number"
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
        setSupplier({
            supplier_number: "",
            name: "",
            telephone_number: "",
            fax_number: "",
            mobile_number: "",
            physical_address: "",
            billing_address: "",
            vat_number: "",
            company_key_number: "",
            memo: "",
            contact_persons: [],
        });
        // setCustomerIndex(customerList.length);
    };

    const handleBack = async (event: any) => {
        event.preventDefault();
        setAdd(false);
        if (supplierIndex) {
            axios
                .get(
                    `http://localhost:8000/api/suppliers/${supplierList[supplierIndex].supplier_number}/?expand=contact_persons`
                )
                .then((res) => setPastSupplier(res.data))
                .catch(() => {
                    setAlertMessage(
                        `Could not retrieve supplier (${supplierList[supplierIndex].supplier_number}).`
                    );
                    setAlertSeverity("error");
                    setAlertVisibility(true);
                });
        } else {
            setPastSupplier({
                supplier_number: "",
                name: "",
                telephone_number: "",
                fax_number: "",
                mobile_number: "",
                physical_address: "",
                billing_address: "",
                vat_number: "",
                company_key_number: "",
                memo: "",
                contact_persons: [],
            });
        }
    };

    const handleCancel = async (event: any) => {
        event.preventDefault();
        setSupplier(pastSupplier);
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
                    `http://localhost:8000/api/suppliers/?expand=contact_persons`,
                    supplier,
                    { headers: { "X-CSRFToken": csrfToken } }
                )
                .then((res) => {
                    axios
                        .get(
                            `http://localhost:8000/api/suppliers/?only=supplier_number,name`
                        )
                        .then((_res) => {
                            const index = _res.data.findIndex(
                                (element: Supplier) =>
                                    element.supplier_number ===
                                    res.data.supplier_number
                            );
                            setSupplierList(_res.data);
                            setSupplierIndex(index);
                        })
                        .catch(() => {
                            setAlertMessage(
                                `Could not retrieve the suppliers.`
                            );
                            setAlertSeverity("error");
                            setAlertVisibility(true);
                            setSupplierIndex("");
                        });
                    setAlertMessage(`Successfully saved ${supplier.name}.`);
                    setAlertSeverity("success");
                    setAlertVisibility(true);
                    setAdd(false);
                })
                .catch(() => {
                    setAlertMessage(`Could not save ${supplier.name}.`);
                    setAlertSeverity("error");
                    setAlertVisibility(true);
                });
        } else {
            axios
                .patch(
                    `http://localhost:8000/api/suppliers/${supplier.supplier_number}/?expand=contact_persons`,
                    supplier,
                    { headers: { "X-CSRFToken": csrfToken } }
                )
                .then((res) => {
                    setPastSupplier(res.data);
                    loadSupplierList();
                    setAlertMessage(`Successfully updated ${supplier.name}.`);
                    setAlertSeverity("success");
                    setAlertVisibility(true);
                })
                .catch(() => {
                    setAlertMessage(`Could not update ${supplier.name}.`);
                    setAlertSeverity("error");
                    setAlertVisibility(true);
                });
        }
    };

    const fieldsDirty = () => {
        return !_.isEqual(supplier, {}) && !_.isEqual(supplier, pastSupplier);
    };

    const isSupplierEmpty = (supplier: Supplier) => {
        return _.isEqual(supplier, {
            supplier_number: "",
            name: "",
            telephone_number: "",
            fax_number: "",
            mobile_number: "",
            physical_address: "",
            billing_address: "",
            vat_number: "",
            company_key_number: "",
            memo: "",
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
                    {fieldsDirty() && !isSupplierEmpty(supplier) && (
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
                                    value={supplierIndex}
                                    margin="normal"
                                    onChange={handleSupplierChange}
                                    label="Supplier"
                                    placeholder="Select a supplier"
                                    disabled={fieldsDirty() || isAdd}
                                    sx={{ width: "100%" }}
                                >
                                    {supplierList?.map(
                                        (supplierItem, index) => (
                                            <MenuItem key={index} value={index}>
                                                {supplierItem.name}
                                            </MenuItem>
                                        )
                                    )}
                                </TextField>
                            </Grid>
                        )}
                        {isAdd && (
                            <Grid item>
                                <TextField
                                    label="Supplier Number"
                                    name="supplier_number"
                                    InputLabelProps={{ shrink: true }}
                                    value={
                                        supplier ? supplier.supplier_number : ""
                                    }
                                    margin="normal"
                                    onChange={handleChange}
                                    disabled={
                                        !isAdd && isSupplierEmpty(supplier)
                                    }
                                    sx={{ width: "100%" }}
                                />
                            </Grid>
                        )}
                        <Grid item>
                            <TextField
                                label="Name"
                                name="name"
                                InputLabelProps={{ shrink: true }}
                                value={supplier ? supplier.name : ""}
                                margin="normal"
                                onChange={handleChange}
                                disabled={!isAdd && isSupplierEmpty(supplier)}
                                sx={{ width: "100%" }}
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                                label="Telephone Number"
                                name="telephone_number"
                                InputLabelProps={{ shrink: true }}
                                value={
                                    supplier ? supplier.telephone_number : ""
                                }
                                margin="normal"
                                onChange={handleChange}
                                disabled={!isAdd && isSupplierEmpty(supplier)}
                                sx={{ width: "100%" }}
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                                label="Fax Number"
                                name="fax_number"
                                InputLabelProps={{ shrink: true }}
                                value={supplier?.fax_number || ""}
                                margin="normal"
                                onChange={handleChange}
                                disabled={!isAdd && isSupplierEmpty(supplier)}
                                sx={{ width: "100%" }}
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                                label="Mobile Number"
                                name="mobile_number"
                                InputLabelProps={{ shrink: true }}
                                value={supplier?.mobile_number}
                                margin="normal"
                                onChange={handleChange}
                                disabled={!isAdd && isSupplierEmpty(supplier)}
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
                                value={supplier?.physical_address}
                                margin="normal"
                                onChange={handleChange}
                                disabled={!isAdd && isSupplierEmpty(supplier)}
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
                                value={supplier?.billing_address}
                                margin="normal"
                                onChange={handleChange}
                                disabled={!isAdd && isSupplierEmpty(supplier)}
                                sx={{ width: "100%" }}
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                                label="VAT Number"
                                name="vat_number"
                                InputLabelProps={{ shrink: true }}
                                value={supplier ? supplier.vat_number : ""}
                                margin="normal"
                                onChange={handleChange}
                                disabled={!isAdd && isSupplierEmpty(supplier)}
                                sx={{ width: "100%" }}
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                                label="CK Number"
                                name="ck_number"
                                InputLabelProps={{ shrink: true }}
                                value={supplier?.company_key_number}
                                margin="normal"
                                onChange={handleChange}
                                disabled={!isAdd && isSupplierEmpty(supplier)}
                                sx={{ width: "100%" }}
                            />
                        </Grid>
                        <Divider />
                        <Grid item>
                            <TextField
                                label="Memo"
                                name="memo"
                                multiline
                                rows={4}
                                InputLabelProps={{ shrink: true }}
                                value={supplier ? supplier.memo : ""}
                                margin="normal"
                                onChange={handleChange}
                                disabled={!isAdd && isSupplierEmpty(supplier)}
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
                            {supplier &&
                                supplier.contact_persons?.map(
                                    (person: ContactPerson, index) => (
                                        <>
                                            <Grid item alignSelf="end">
                                                <Button
                                                    onClick={(event) => {
                                                        event.preventDefault();
                                                        setSupplier((prev) => ({
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
                                                            setSupplier(
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
                                                            setSupplier(
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
                                                            setSupplier(
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
                                                            setSupplier(
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

                            {(!isSupplierEmpty(supplier) || isAdd) && (
                                <Grid item>
                                    <Button
                                        sx={{ margin: "normal", width: "100%" }}
                                        onClick={(event) => {
                                            event.preventDefault();
                                            setSupplier((prev) => ({
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
