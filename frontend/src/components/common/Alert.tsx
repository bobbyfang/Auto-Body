import { ClickAwayListener, Alert as MUIAlert } from "@mui/material";

export default function Alert({ message, severity, onClick }) {
    return (
        <ClickAwayListener onClickAway={onClick}>
            <div>
                <MUIAlert
                    severity={severity}
                    id="alert"
                    onClick={onClick}
                    sx={{
                        position: "fixed",
                        bottom: 10,
                        // left: 130,
                        // transform: 'translateX(-50%)',
                        zIndex: 9999,
                    }}
                >
                    {message}
                </MUIAlert>
            </div>
        </ClickAwayListener>
    );
}
