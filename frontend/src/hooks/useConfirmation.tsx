import _ from "lodash";
import { ReactNode, useState } from "react";

export interface ConfirmationHookProps {
    isConfirmationOpen: boolean;
    setConfirmationOpen: React.Dispatch<React.SetStateAction<boolean>>;
    confirmationMessage: ReactNode;
    setConfirmationMessage: React.Dispatch<React.SetStateAction<ReactNode>>;
    onConfirm: () => void;
    setOnConfirm: React.Dispatch<React.SetStateAction<() => void>>;
}

export default function useConfirmation(): ConfirmationHookProps {
    const [isConfirmationOpen, setConfirmationOpen] = useState(false);
    const [confirmationMessage, setConfirmationMessage] = useState<ReactNode>(
        <></>
    );
    const [onConfirm, setOnConfirm] = useState<() => void>(() => {});

    return {
        isConfirmationOpen,
        setConfirmationOpen,
        confirmationMessage,
        setConfirmationMessage,
        onConfirm,
        setOnConfirm,
    };
}
