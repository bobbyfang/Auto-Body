import { useContext, useState } from "react";
import { AlertContext } from "../contexts/alertContext";
import { Customer } from "../components/Customers";
import axios from "axios";

export default function useCustomer() {
    const { setAlertMessage, setAlertSeverity, setAlertVisibility } =
        useContext(AlertContext);

    const [customer, setCustomer] = useState<Customer>({ customer_number: "" });

    const saveCustomer = (customer_number: string) => {
        if (customer_number) {
            axios
                .get(`http://localhost:8000/api/customers/${customer_number}/`)
                .then((res) => {
                    setCustomer(res.data);
                })
                .catch(() => {
                    setAlertMessage(
                        `Customer with number "${customer_number}" was not found.`
                    );
                    setAlertSeverity("error");
                    setAlertVisibility(true);
                });
        } else {
            setCustomer({ customer_number: "" });
        }
    };

    return { customer: customer, setCustomer: saveCustomer };
}
