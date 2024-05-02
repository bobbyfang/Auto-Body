import { useEffect, useState } from "react";

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

    useEffect(() => {
        if (isAlertVisible) {
            const timer = setTimeout(() => {
                setAlertVisibility(false);
            }, 5000);

            return () => {
                clearTimeout(timer);
            };
        }
    }, [isAlertVisible]);

    return {
        alertMessage,
        setAlertMessage,
        isAlertVisible,
        setAlertVisibility,
        alertSeverity,
        setAlertSeverity,
    };
}
