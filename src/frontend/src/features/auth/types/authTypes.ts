/**
 * Represents a user in the system.
 */
export interface User {
    id: string;
    username: string;
    email: string;
    fullName: string;
    createdAt: string;
    isActive: boolean;
    name: string;
}

/**
 * Response structure for successful login/registration.
 */
export interface LoginResponse {
    token: string;
    user: User;
}
