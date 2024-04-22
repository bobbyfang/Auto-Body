export interface User {
    id?: number;
    is_superuser?: boolean;
    username: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    is_staff?: boolean;
    is_active?: boolean;
    date_joined?: string;
    groups?: [];
    user_permissions?: [];
}
