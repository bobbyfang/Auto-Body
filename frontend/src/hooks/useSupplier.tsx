import { useContext, useState } from "react";
import { AlertContext } from "../contexts/alertContext";
import { Customer } from "../components/Customers";
import axios from "axios";

export default function useSupplier() {
    const { setAlertMessage, setAlertSeverity, setAlertVisibility } =
        useContext(AlertContext);

    const [supplier, setSupplier] = useState<Customer>({ supplier_number: "" });

    const saveSupplier = (supplier_number: string) => {
        if (supplier_number) {
            axios
                .get(`http://localhost:8000/api/suppliers/${supplier_number}/`)
                .then((res) => {
                    setSupplier(res.data);
                })
                .catch(() => {
                    setAlertMessage(
                        `Supplier with number "${supplier_number}" was not found.`
                    );
                    setAlertSeverity("error");
                    setAlertVisibility(true);
                });
        } else {
            setSupplier({ supplier_number: "" });
        }
    };

    return [supplier, saveSupplier];
}
