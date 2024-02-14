import { ChangeEvent, useEffect, useState } from "react";
import Content from "../Content";
import {
    Box,
    Button,
    Checkbox,
    Divider,
    FormControlLabel,
    FormGroup,
    Paper,
    Stack,
    TextField,
} from "@mui/material";
import ProductsModal from "../ProductsModal";
import CurrencyInput from "react-currency-input-field";
import _ from "lodash";
import Carousal from "react-material-ui-carousel";
import { Add, Close, KeyboardBackspace, Save } from "@mui/icons-material";

export const Product = {
    product_number: "",
    description: "",
    oem_number: "",
    make: "",
    model: "",
    year: "",
    quantity: "",
    safety_quantity: "",
    in_transit: "",
    units: "",
    fob_cost: "",
    retail_price: "",
    prices: [],
    manual_price: false,
};

interface PriceLevel {
    level?: string;
    price?: string;
}

export default function Products() {
    const [pastProduct, setPastProduct] = useState<typeof Product>(Product);
    const [product, setProduct] = useState<typeof Product>(Product);

    const [isAlertVisible, setAlertVisibility] = useState(false);
    const [severity, setSeverity] = useState("");
    const [alertMessage, setAlertMessage] = useState("");

    const [productsModalOpen, setProductsModalOpen] = useState(false);
    const [imagesModalOpen, setImagesModalOpen] = useState(false);

    const [isAdd, setAdd] = useState(false);

    useEffect(() => {
        setProduct(pastProduct);
    }, [pastProduct]);
    // useEffect(() => {
    //     console.log(product);
    // }, [product]);

    const handleProductChange = (event: ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        setProduct((prevProduct: typeof Product) => {
            if (event.target.value) {
                return {
                    ...prevProduct,
                    [event.target.name]:
                        event.target.name === "product_number"
                            ? event.target.value.toUpperCase()
                            : event.target.value,
                };
            } else {
                console.log("no value");

                delete prevProduct[event.target.name];
                console.log(prevProduct);

                return { ...prevProduct };
            }
        });
    };

    const handleAdd = () => {
        setProduct(Product);
        setAdd(true);
    };

    const handleBack = () => {
        setAdd(false);
        setProduct(pastProduct);
    };

    const handleCancel = () => {
        setProduct(pastProduct);
    };

    const handleSave = () => {};

    const handleCheckboxChange = (
        event: ChangeEvent<HTMLInputElement>,
        checked: boolean
    ) => {
        setProduct((prevProduct: typeof Product) => {
            return {
                ...prevProduct,
                [event.target.name]: checked,
            };
        });
    };

    const fieldsDirty = () => {
        // console.log(product);

        // return !_.isEqual(pastProduct, {}) && !_.isEqual(pastProduct, product);
        return !_.isEqual(pastProduct, product);
    };

    return (
        <>
            <Content
                isAlertVisible={isAlertVisible}
                setAlertVisibility={setAlertVisibility}
                alertMessage={alertMessage}
                severity={severity}
            >
                <Stack direction="row" justifyContent="space-between">
                    <Button
                        onClick={handleAdd}
                        disabled={fieldsDirty()}
                        sx={{ display: isAdd || fieldsDirty() ? "none" : "" }}
                    >
                        <Add />
                        Add
                    </Button>
                    <Button
                        onClick={handleCancel}
                        sx={{ display: fieldsDirty() && !isAdd ? "" : "none" }}
                    >
                        <Close />
                        Cancel
                    </Button>
                    <Button
                        onClick={handleBack}
                        sx={{ display: isAdd ? "" : "none" }}
                    >
                        <KeyboardBackspace />
                        Back
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={!fieldsDirty()}
                        sx={{
                            display:
                                fieldsDirty() && !_.isEqual(product, {})
                                    ? ""
                                    : "none",
                        }}
                    >
                        <Save /> {isAdd ? "Save" : "Update"}
                    </Button>
                </Stack>
                <ProductsModal
                    open={productsModalOpen}
                    setOpen={setProductsModalOpen}
                    setAlertVisibility={setAlertVisibility}
                    setAlertMessage={setAlertMessage}
                    setSeverity={setSeverity}
                    setProduct={setPastProduct}
                />

                <Stack direction="row" justifyContent="space-between">
                    <Box
                        margin={"normal"}
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "center",
                        }}
                    >
                        <TextField
                            InputLabelProps={{ shrink: true }}
                            value={product.product_number ?? ""}
                            label="Product Number"
                            disabled={!isAdd}
                            name="product_number"
                            onChange={handleProductChange}
                        />
                        <Button
                            onClick={() => setProductsModalOpen(true)}
                            disabled={fieldsDirty()}
                        >
                            Select
                        </Button>
                        <TextField
                            InputLabelProps={{ shrink: true }}
                            value={product.oem_number}
                            label="OEM Number"
                            contentEditable={false}
                            disabled={_.isEqual(product, {})}
                            name="oem_number"
                            onChange={handleProductChange}
                        />
                    </Box>
                </Stack>
                <Divider
                    textAlign="left"
                    sx={{
                        color: "black",
                    }}
                >
                    Vehicle Details
                </Divider>
                <TextField
                    InputLabelProps={{ shrink: true }}
                    value={product.make ?? ""}
                    label="Make"
                    margin="normal"
                    contentEditable={false}
                    name="make"
                    onChange={handleProductChange}
                />
                <TextField
                    InputLabelProps={{ shrink: true }}
                    value={product.model ?? ""}
                    label="Model"
                    margin="normal"
                    contentEditable={false}
                    name="model"
                    onChange={handleProductChange}
                />
                <TextField
                    InputLabelProps={{ shrink: true }}
                    value={product.year ?? ""}
                    label="Year"
                    margin="normal"
                    contentEditable={false}
                    name="year"
                    onChange={handleProductChange}
                />
                <Divider
                    textAlign="left"
                    sx={{
                        color: "black",
                    }}
                >
                    Product Details
                </Divider>
                <Stack direction="row">
                    <TextField
                        InputLabelProps={{ shrink: true }}
                        value={product.description ?? ""}
                        label="Description"
                        margin="normal"
                        contentEditable={false}
                        name="description"
                        onChange={handleProductChange}
                    />
                    <TextField
                        InputLabelProps={{ shrink: true }}
                        value={product.quantity ?? ""}
                        label="Quantity"
                        margin="normal"
                        contentEditable={false}
                        name="quantity"
                        onChange={handleProductChange}
                    />
                    <TextField
                        InputLabelProps={{ shrink: true }}
                        value={product.safety_quantity ?? ""}
                        label="Safety Quantity"
                        margin="normal"
                        contentEditable={false}
                        name="safety_quantity"
                        onChange={handleProductChange}
                    />
                    <TextField
                        InputLabelProps={{ shrink: true }}
                        value={product.in_transit ?? ""}
                        label="In Transit Quantity"
                        margin="normal"
                        contentEditable={false}
                        name="in_transit"
                        onChange={handleProductChange}
                    />
                    <TextField
                        InputLabelProps={{ shrink: true }}
                        value={product.units ?? ""}
                        label="Units"
                        margin="normal"
                        contentEditable={false}
                        name="units"
                        onChange={handleProductChange}
                    />
                </Stack>
                <Divider
                    textAlign="left"
                    sx={{
                        color: "black",
                    }}
                >
                    Pricing
                </Divider>
                <Stack direction="column">
                    <Stack direction="row">
                        <TextField
                            InputLabelProps={{ shrink: true }}
                            value={
                                product.fob_cost !== undefined
                                    ? product.fob_cost
                                    : null
                            }
                            defaultValue={0}
                            label="FOB Cost"
                            margin="normal"
                            contentEditable={false}
                            name="fob_cost"
                            InputProps={{
                                inputComponent: CurrencyInput,
                                inputProps: {
                                    // value: product.fob_cost ?? "",
                                    prefix: "R",
                                    defaultValue: 0,
                                    decimalSeparator: ".",
                                    decimalScale: 2,
                                    disableAbbreviations: true,
                                    placeholder: "R",
                                    onValueChange: async (value: string) => {
                                        if (value === undefined) {
                                            value = "0";
                                        }
                                        setProduct({
                                            ...product,
                                            fob_cost: value,
                                        });
                                    },
                                },
                            }}
                            // onChange={}
                        />
                        <TextField
                            InputLabelProps={{ shrink: true }}
                            value={
                                product.retail_price !== "undefined"
                                    ? product.retail_price
                                    : 0
                            }
                            label="Retail Price"
                            margin="normal"
                            contentEditable={false}
                            name="retail_price"
                            InputProps={{
                                inputComponent: CurrencyInput,
                                inputProps: {
                                    // value: product.fob_cost ?? "",
                                    prefix: "R",
                                    defaultValue: 0,
                                    decimalSeparator: ".",
                                    decimalScale: 2,
                                    disableAbbreviations: true,
                                    placeholder: "R",
                                    onValueChange: async (value: string) => {
                                        if (value === undefined) {
                                            value = "0";
                                        }
                                        setProduct({
                                            ...product,
                                            retail_price: value,
                                        });
                                    },
                                },
                            }}
                            // onChange={handleProductChange}
                        />
                    </Stack>
                    <FormGroup>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    name="manual_price"
                                    checked={product.manual_price}
                                    onChange={handleCheckboxChange}
                                />
                            }
                            label="Manual Price"
                            sx={{ color: "black" }}
                        />
                    </FormGroup>
                    {product.prices?.map((price: PriceLevel, index) => (
                        <TextField
                            InputLabelProps={{ shrink: true }}
                            value={price.price ?? ""}
                            label={`${price.level} Price`}
                            margin="normal"
                            contentEditable={false}
                            name={`${price.level}`}
                            InputProps={{
                                inputComponent: CurrencyInput,
                                inputProps: {
                                    // value: product.fob_cost ?? "",
                                    prefix: "R",
                                    defaultValue: 0,
                                    decimalSeparator: ".",
                                    decimalScale: 2,
                                    disableAbbreviations: true,
                                    placeholder: "R",
                                    onValueChange: async (value: string) => {
                                        let tempPrices = [...product.prices];
                                        if (tempPrices) {
                                            tempPrices[index] = {
                                                ...tempPrices[index],
                                                price: value,
                                            };
                                            setProduct({
                                                ...product,
                                                prices: tempPrices,
                                            });
                                        }
                                    },
                                },
                            }}
                        />
                    ))}
                </Stack>
                <>
                    <Divider
                        textAlign="left"
                        sx={{
                            color: "black",
                        }}
                    >
                        Pictures
                    </Divider>
                    <Carousal
                        sx={{
                            // height: "400px",
                            width: "400px",
                        }}
                        navButtonsAlwaysVisible
                    >
                        <Paper
                            sx={{
                                height: "400px",
                                width: "400px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <img
                                src="http://localhost/images/products/TY010860FH-0.jpeg"
                                style={{
                                    maxWidth: "100%",
                                    maxHeight: "100%",
                                    objectFit: "contain",
                                }}
                            />
                        </Paper>
                        <Paper
                            sx={{
                                height: "400px",
                                width: "400px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <img
                                src="http://localhost/images/products/TY010860FH-1.jpeg"
                                style={{
                                    maxWidth: "100%",
                                    maxHeight: "100%",
                                    objectFit: "contain",
                                }}
                            />
                        </Paper>
                    </Carousal>
                </>
            </Content>
        </>
    );
}
