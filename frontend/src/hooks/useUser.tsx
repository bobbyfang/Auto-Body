import { useContext, useState } from "react";
import { AlertContext } from "../contexts/alertContext";
import { User } from "../components/common/User";
import axios from "axios";

export default function useUser(): [
    user: User,
    saveUser: (username: string) => void
] {
    const { setAlertMessage, setAlertSeverity, setAlertVisibility } =
        useContext(AlertContext);

    const [user, setUser] = useState<User>({ username: "" });

    const saveUser = (username: string) => {
        if (username) {
            axios
                .get(`http://localhost:8000/api/users/${username}`)
                .then((res) => {
                    setUser(res.data);
                })
                .catch(() => {
                    setAlertMessage(
                        `User with username "${username}" was not found.`
                    );
                    setAlertSeverity("error");
                    setAlertVisibility(true);
                });
        }
    };

    return [user, saveUser];
}
