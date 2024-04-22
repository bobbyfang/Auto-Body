import { useEffect } from "react";
import "./App.css";

import Login from "./components/Login/Login";
import useAlert from "./hooks/useAlert";
import useToken from "./hooks/useToken";
import DashboardLayout from "./layouts/dashboard";
import Alert from "./components/common/Alert";
import { AlertContext } from "./contexts/alertContext";

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
                {isAlertVisible && (
                    <Alert
                        message={alertMessage}
                        severity={alertSeverity}
                        onClick={() => setAlertVisibility(false)}
                    />
                )}
                <DashboardLayout token={token} setToken={setToken} />
            </AlertContext.Provider>
        </>
    );
}

export default App;
