import { createContext } from "react";

interface AlertContextProps {
    setAlertMessage: React.Dispatch<React.SetStateAction<string>>;
    setAlertVisibility: React.Dispatch<React.SetStateAction<boolean>>;
    setAlertSeverity: React.Dispatch<React.SetStateAction<string>>;
}

export const AlertContext = createContext<AlertContextProps>(
    {} as AlertContextProps
);
