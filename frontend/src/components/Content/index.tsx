import { Box } from "@mui/material";
import Alert from "../common/Alert";
import { ReactNode, useEffect } from "react";

interface ContentProps {
    children?: ReactNode;
    isAlertVisible: boolean;
    setAlertVisibility: any;
    alertMessage: string;
    severity: string;
}

export default function Content({
    children,
    isAlertVisible,
    setAlertVisibility,
    alertMessage,
    severity,
}: ContentProps) {
    useEffect(() => {
        const timer = setTimeout(() => {
            setAlertVisibility(false);
        }, 5000);

        return () => {
            clearTimeout(timer);
        };
    }, [isAlertVisible]);

    return (
        <>
            <Box
                sx={{
                    backgroundColor: "white",
                    padding: "20px",
                }}
            >
                {children}
                {isAlertVisible && (
                    <Alert
                        message={alertMessage}
                        severity={severity}
                        onClick={() => setAlertVisibility(false)}
                    />
                )}
            </Box>
        </>
    );
}
