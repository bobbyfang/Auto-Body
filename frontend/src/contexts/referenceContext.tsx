import { createContext } from "react";
import { User } from "../components/common/User";
import { Customer } from "../components/Customers";
import { Quotation } from "../components/Quotations";
import { Invoice } from "../components/Invoices";
import { Order } from "../components/Orders";

interface ReferenceContextProps {
    reference_item: Quotation | Order | Invoice;
    customer: Customer;
    user: User;
}

export const ReferenceContext = createContext<ReferenceContextProps>(
    {} as ReferenceContextProps
);
