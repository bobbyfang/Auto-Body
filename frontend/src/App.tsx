import { ReactNode, useState } from "react";
import "./App.css";

import Login from "./components/Login/Login";
import useAlert from "./hooks/useAlert";
import useToken from "./hooks/useToken";
import DashboardLayout from "./layouts/dashboard";
import Alert from "./components/common/Alert";
import { AlertContext } from "./contexts/alertContext";
import ConfirmationDialogue from "./components/ConfirmationDialogue";
import { ConfirmationContext } from "./contexts/confirmationContext";
import useConfirmation from "./hooks/useConfirmation";

function App() {
    const { token, setToken } = useToken();
    const {
        alertMessage,
        setAlertMessage,
        isAlertVisible,
        setAlertVisibility,
        alertSeverity,
        setAlertSeverity,
    } = useAlert();

    const {
        isConfirmationOpen,
        setConfirmationOpen,
        confirmationMessage,
        setConfirmationMessage,
        onConfirm,
        setOnConfirm,
    } = useConfirmation();

    if (!token) {
        return (
            <>
                <Login setToken={setToken} />
            </>
        );
    }
    return (
        <>
            <AlertContext.Provider
                value={{
                    setAlertMessage: setAlertMessage,
                    setAlertSeverity: setAlertSeverity,
                    setAlertVisibility: setAlertVisibility,
                }}
            >
                <ConfirmationContext.Provider
                    value={{
                        setConfirmationMessage: setConfirmationMessage,
                        setConfirmationOpen: setConfirmationOpen,
                        setOnConfirm: setOnConfirm,
                    }}
                >
                    {isAlertVisible && (
                        <Alert
                            message={alertMessage}
                            severity={alertSeverity}
                            onClick={() => setAlertVisibility(false)}
                        />
                    )}
                    {isConfirmationOpen && (
                        <ConfirmationDialogue
                            modalProps={{
                                open: isConfirmationOpen,
                                setOpen: setConfirmationOpen,
                            }}
                            message={confirmationMessage}
                            onConfirm={onConfirm}
                        />
                    )}
                    <DashboardLayout token={token} setToken={setToken} />
                </ConfirmationContext.Provider>
            </AlertContext.Provider>
        </>
    );
}

export default App;
