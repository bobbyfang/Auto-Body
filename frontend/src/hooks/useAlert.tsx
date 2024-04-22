import { useState } from "react";

export interface AlertHookProps {
    alertMessage: string;
    setAlertMessage: React.Dispatch<React.SetStateAction<string>>;
    isAlertVisible: boolean;
    setAlertVisibility: React.Dispatch<React.SetStateAction<boolean>>;
    alertSeverity: string;
    setAlertSeverity: React.Dispatch<React.SetStateAction<string>>;
}

export default function useAlert(): AlertHookProps {
    const [alertMessage, setAlertMessage] = useState("");
    const [isAlertVisible, setAlertVisibility] = useState(false);
    const [alertSeverity, setAlertSeverity] = useState("success");

    return {
        alertMessage,
        setAlertMessage,
        isAlertVisible,
        setAlertVisibility,
        alertSeverity,
        setAlertSeverity,
    };
}
