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
import {
    Add,
    Close,
    KeyboardBackspace,
    Replay,
    Save,
} from "@mui/icons-material";
import axios from "axios";

const Product = {
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
    fob_cost: "0",
    retail_price: "0",
    prices: [] as ProductPrice[],
    manual_price: false,
};

interface ProductPrice {
    level?: string;
    price?: string;
}

interface PriceLevel {
    level_name: string;
    markdown_percentage: string;
}

export default function Products() {
    useEffect(() => {
        axios
            .get("http://localhost:8000/api/price_levels/")
            .then((res) => {
                Product.prices = res.data.map((level: any) => ({
                    level: level.level_name,
                    price: "0",
                }));
                setPriceLevels(res.data);
            })
            .catch(() => {
                setAlertMessage(`Could not retrieve the products.`);
                setSeverity("error");
                setAlertVisibility(true);
            });
    }, []);

    const [pastProduct, setPastProduct] = useState<typeof Product>(Product);
    const [product, setProduct] = useState<typeof Product>(Product);
    const [priceLevels, setPriceLevels] = useState<PriceLevel[]>([]);

    const [isAlertVisible, setAlertVisibility] = useState(false);
    const [severity, setSeverity] = useState("");
    const [alertMessage, setAlertMessage] = useState("");

    const [productsModalOpen, setProductsModalOpen] = useState(false);
    const [imagesModalOpen, setImagesModalOpen] = useState(false);

    const [isAdd, setAdd] = useState(false);

    useEffect(() => {
        setProduct(pastProduct);
    }, [pastProduct]);

    const handleProductChange = (event: ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        setProduct((_product: typeof Product) => {
            return {
                ..._product,
                [event.target.name]:
                    event.target.name === "product_number"
                        ? event.target.value.toUpperCase()
                        : event.target.value,
            };
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

    const handleSave = async () => {
        const csrfToken = await axios
            .get("http://localhost:8000/csrf_token/")
            .then((response) => response.data.csrfToken)
            .catch((error) => console.error(error));
        if (isAdd) {
            console.log("is Add");
            axios
                .post(`http://localhost:8000/api/products/`, product, {
                    headers: { "X-CSRFToken": csrfToken },
                })
                .then(() => {
                    setPastProduct(product);
                    setAlertMessage(
                        `Successfully saved or updated ${product.product_number}.`
                    );
                    setSeverity("success");
                    setAlertVisibility(true);
                })
                .catch(() => {
                    setAlertMessage(
                        `Could not save or update ${product.product_number}.`
                    );
                    setSeverity("error");
                    setAlertVisibility(true);
                });
        } else {
            console.log("is Update");
            axios
                .patch(
                    `http://localhost:8000/api/products/${product.product_number}/`,
                    product,
                    { headers: { "X-CSRFToken": csrfToken } }
                )
                .then(() => {
                    setPastProduct(product);
                    setAlertMessage(
                        `Successfully saved or updated ${product.product_number}.`
                    );
                    setSeverity("success");
                    setAlertVisibility(true);
                })
                .catch(() => {
                    setAlertMessage(
                        `Could not save or update ${product.product_number}.`
                    );
                    setSeverity("error");
                    setAlertVisibility(true);
                });
        }
    };

    const handleCheckboxChange = (
        event: ChangeEvent<HTMLInputElement>,
        checked: boolean
    ) => {
        setProduct((_product: typeof Product) => {
            if (checked) {
                return {
                    ..._product,
                    [event.target.name]: checked,
                };
            } else {
                return {
                    ..._product,
                    [event.target.name]: checked,
                    prices: _product.prices.map((productPrice, index) => {
                        return {
                            ...productPrice,
                            price: `${
                                (parseFloat(_product.retail_price) *
                                    (100.0 -
                                        parseFloat(
                                            priceLevels[index]
                                                .markdown_percentage
                                        ))) /
                                100.0
                            }`,
                        };
                    }),
                };
            }
        });
    };

    const fieldsDirty = () => {
        return !_.isEqual(pastProduct, product);
    };

    const handleResetPrices = () => {
        setProduct((_product) => ({
            ..._product,
            manual_price: pastProduct.manual_price,
            prices: pastProduct.prices,
        }));
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
                            disabled={!isAdd && _.isEqual(product, Product)}
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
                    disabled={!isAdd && _.isEqual(product, Product)}
                />
                <TextField
                    InputLabelProps={{ shrink: true }}
                    value={product.model ?? ""}
                    label="Model"
                    margin="normal"
                    contentEditable={false}
                    name="model"
                    onChange={handleProductChange}
                    disabled={!isAdd && _.isEqual(product, Product)}
                />
                <TextField
                    InputLabelProps={{ shrink: true }}
                    value={product.year ?? ""}
                    label="Year"
                    margin="normal"
                    contentEditable={false}
                    name="year"
                    onChange={handleProductChange}
                    disabled={!isAdd && _.isEqual(product, Product)}
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
                        disabled={!isAdd && _.isEqual(product, Product)}
                    />
                    <TextField
                        InputLabelProps={{ shrink: true }}
                        value={product.quantity ?? ""}
                        label="Quantity"
                        margin="normal"
                        contentEditable={false}
                        name="quantity"
                        onChange={handleProductChange}
                        disabled={!isAdd && _.isEqual(product, Product)}
                    />
                    <TextField
                        InputLabelProps={{ shrink: true }}
                        value={product.safety_quantity ?? ""}
                        label="Safety Quantity"
                        margin="normal"
                        contentEditable={false}
                        name="safety_quantity"
                        onChange={handleProductChange}
                        disabled={!isAdd && _.isEqual(product, Product)}
                    />
                    <TextField
                        InputLabelProps={{ shrink: true }}
                        value={product.in_transit ?? ""}
                        label="In Transit Quantity"
                        margin="normal"
                        contentEditable={false}
                        name="in_transit"
                        onChange={handleProductChange}
                        disabled={!isAdd && _.isEqual(product, Product)}
                    />
                    <TextField
                        InputLabelProps={{ shrink: true }}
                        value={product.units ?? ""}
                        label="Units"
                        margin="normal"
                        contentEditable={false}
                        name="units"
                        onChange={handleProductChange}
                        disabled={!isAdd && _.isEqual(product, Product)}
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
                            disabled={!isAdd && _.isEqual(product, Product)}
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
                            disabled={!isAdd && _.isEqual(product, Product)}
                        />
                    </Stack>
                    <Stack direction="row">
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
                        <Button
                            sx={{
                                visibility: _.isEqual(
                                    product.prices,
                                    pastProduct.prices
                                )
                                    ? "hidden"
                                    : "visible",
                            }}
                            onClick={handleResetPrices}
                        >
                            <Replay />
                            Reset Prices
                        </Button>
                    </Stack>
                    {product.prices?.map((price: ProductPrice, index) => (
                        <TextField
                            key={index}
                            InputLabelProps={{ shrink: true }}
                            value={price.price ?? ""}
                            label={`${price.level} Price`}
                            margin="normal"
                            name={`${price.level}`}
                            InputProps={{
                                inputComponent: CurrencyInput,
                                inputProps: {
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
                            disabled={
                                (!isAdd && _.isEqual(product, Product)) ||
                                !product.manual_price
                            }
                        />
                    ))}
                </Stack>
                {_.isEqual(product, Product) ? (
                    <></>
                ) : (
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
                )}
            </Content>
        </>
    );
}
