import { Search } from "@mui/icons-material";
import {
    FilledInputProps,
    IconButton,
    OutlinedInputProps,
    TextField,
    TextFieldProps,
} from "@mui/material";

export default function SearchTextField({
    value,
    label,
    disabled,
    onSearchButtonClick = () => {},
    onKeyUp = () => {},
    onChange = undefined,
    InputProps,
    props,
}: {
    value: string;
    label: string;
    disabled?: boolean;
    onSearchButtonClick?: () => void;
    onKeyUp?: (event: any) => void;
    onChange?: (event: any) => void;
    InputProps?: Partial<FilledInputProps> | Partial<OutlinedInputProps>;
    props?: TextFieldProps;
}) {
    return (
        <>
            <TextField
                margin="normal"
                value={value}
                InputLabelProps={{ shrink: true }}
                label={label}
                InputProps={{
                    ...InputProps,
                    endAdornment: (
                        <IconButton
                            edge="end"
                            onClick={onSearchButtonClick}
                            disabled={
                                InputProps?.readOnly || disabled ? true : false
                            }
                        >
                            <Search />
                        </IconButton>
                    ),
                }}
                onKeyUp={onKeyUp}
                onChange={onChange}
                {...props}
            />
        </>
    );
}
