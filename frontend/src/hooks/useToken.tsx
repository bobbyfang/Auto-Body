import axios from "axios";
import { useState } from "react";

function useToken() {
    const getToken = (): string => {
        const expiry = localStorage.getItem("expiry");
        const tokenString = localStorage.getItem("token") as string;
        if (expiry && new Date(expiry as string) < new Date()) {
            return "";
        }
        axios.defaults.headers.common["Authorization"] = tokenString
            ? `Bearer ${tokenString}`
            : null;
        return tokenString;
    };

    const [token, setToken] = useState(getToken());

    const saveToken = (userToken: any): void => {
        localStorage.setItem("token", userToken);
        setToken(userToken);
        axios.defaults.headers.common["Authorization"] = userToken
            ? `Bearer ${userToken}`
            : null;
    };

    return {
        setToken: saveToken,
        token,
    };
}

export default useToken;
