import { useState } from "react";
import Content from "../Content";
import {
    Box,
    Button,
    Checkbox,
    Divider,
    FormControlLabel,
    FormGroup,
    Stack,
    TextField,
} from "@mui/material";
import ProductsModal from "../ProductsModal";
import CurrencyInput from "react-currency-input-field";
import _ from "lodash";

export interface Product {
    product_number?: string;
    description?: string;
    oem_number?: string;
    make?: string;
    model?: string;
    year?: string;
    quantity?: string;
    safety_quantity?: string;
    in_transit?: string;
    units?: string;
    fob_cost?: string;
    retail_price?: string;
    prices?: [];
    manual_price?: boolean;
}

interface PriceLevel {
    level?: string;
    price?: string;
}

export default function Products() {
    const [product, setProduct] = useState<Product>({});

    const [isAlertVisible, setAlertVisibility] = useState(false);
    const [severity, setSeverity] = useState("");
    const [alertMessage, setAlertMessage] = useState("");

    const [open, setOpen] = useState(false);

    // useEffect(() => {
    //     console.log(product);

    // }, [product])

    return (
        <>
            <Content
                isAlertVisible={isAlertVisible}
                setAlertVisibility={setAlertVisibility}
                alertMessage={alertMessage}
                severity={severity}
            >
                <ProductsModal
                    open={open}
                    setOpen={setOpen}
                    setAlertVisibility={setAlertVisibility}
                    setAlertMessage={setAlertMessage}
                    setSeverity={setSeverity}
                    setProduct={setProduct}
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
                            value={product?.product_number}
                            label="Product Number"
                            contentEditable={false}
                            disabled={true}
                            name="product_number"
                        />
                        <Button onClick={() => setOpen(true)}>Select</Button>
                        <TextField
                            InputLabelProps={{ shrink: true }}
                            value={product?.oem_number}
                            label="OEM Number"
                            contentEditable={false}
                            disabled={_.isEqual(product, {})}
                            name="oem_number"
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
                    value={product?.make}
                    label="Make"
                    margin="normal"
                    contentEditable={false}
                    name="make"
                    // disabled={}
                />
                <TextField
                    InputLabelProps={{ shrink: true }}
                    value={product?.model}
                    label="Model"
                    margin="normal"
                    contentEditable={false}
                    name="model"
                    // disabled={true}
                />
                <TextField
                    InputLabelProps={{ shrink: true }}
                    value={product?.year}
                    label="Year"
                    margin="normal"
                    contentEditable={false}
                    name="year"
                    // disabled={true}
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
                        value={product?.description}
                        label="Description"
                        margin="normal"
                        contentEditable={false}
                        name="description"
                        // disabled={true}
                    />
                    <TextField
                        InputLabelProps={{ shrink: true }}
                        value={product?.quantity}
                        label="Quantity"
                        margin="normal"
                        contentEditable={false}
                        name="quantity"
                        // disabled={true}
                    />
                    <TextField
                        InputLabelProps={{ shrink: true }}
                        value={product?.safety_quantity}
                        label="Safety Quantity"
                        margin="normal"
                        contentEditable={false}
                        name="safety_quantity"
                        // disabled={true}
                    />
                    <TextField
                        InputLabelProps={{ shrink: true }}
                        value={product?.in_transit}
                        label="In Transit Quantity"
                        margin="normal"
                        contentEditable={false}
                        name="in_transit"
                        // disabled={true}
                    />
                    <TextField
                        InputLabelProps={{ shrink: true }}
                        value={product?.units}
                        label="Units"
                        margin="normal"
                        contentEditable={false}
                        name="units"
                        // disabled={true}
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
                            value={product?.fob_cost ?? ""}
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
                                        setProduct({
                                            ...product,
                                            fob_cost: `${value}`,
                                        });
                                    },
                                },
                            }}
                        />
                        <TextField
                            InputLabelProps={{ shrink: true }}
                            value={product?.retail_price ?? ""}
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
                                        setProduct({
                                            ...product,
                                            retail_price: `${value}`,
                                        });
                                    },
                                },
                            }}
                        />
                    </Stack>
                    <FormGroup>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={product?.manual_price ?? false}
                                />
                            }
                            label="Manual Price"
                            sx={{ color: "black" }}
                        />
                    </FormGroup>
                    {product?.prices?.map((price: PriceLevel, index) => (
                        <TextField
                            InputLabelProps={{ shrink: true }}
                            value={price?.price ?? ""}
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
                                        let tempPrices = product.prices;
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
            </Content>
        </>
    );
}
