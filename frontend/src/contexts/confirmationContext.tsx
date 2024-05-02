import { createContext, ReactNode } from "react";

interface ConfirmationContextProps {
    setConfirmationOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setConfirmationMessage: React.Dispatch<React.SetStateAction<ReactNode>>;
    setOnConfirm: React.Dispatch<React.SetStateAction<() => void>>;
}

export const ConfirmationContext = createContext<ConfirmationContextProps>(
    {} as ConfirmationContextProps
);
