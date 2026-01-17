import { authService } from '../services/authService';
import type { LoginResponse, User } from '../types/authTypes';

/**
 * AUTH FEATURE FACADE
 */

export const login = (username: string, password: string): Promise<LoginResponse> => {
    return authService.login(username, password);
};

export const register = (username: string, email: string, password: string, fullName: string): Promise<LoginResponse> => {
    return authService.register(username, email, password, fullName);
};

export const logout = (): Promise<void> => {
    return authService.logout();
};

export const getCurrentUser = (): Promise<User> => {
    return authService.me();
};

