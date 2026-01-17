import { apiClient } from '@/api/axiosConfig';
import { handleApiRequest } from '@/api/apiHelper';
import { useAuthStore } from '@/store/authStore';
import type { LoginResponse, User } from '../types/authTypes';

/**
 * Authentication Service - Business Logic Layer
 * Direct API consumption using a global helper
 */
export const authService = {
    /**
     * User Login
     * Endpoint: /Auth/login
     */
    login: async (username: string, password: string): Promise<LoginResponse> => {
        const data = await handleApiRequest<LoginResponse>(
            apiClient.post('/Auth/login', {
                username,
                password
            })
        );

        const userWithCompatibility: User = {
            ...data.user,
            name: data.user.fullName || data.user.username || 'User'
        };

        const response: LoginResponse = {
            token: data.token,
            user: userWithCompatibility
        };

        useAuthStore.getState().login(response.user, response.token);
        return response;
    },

    /**
     * User Registration
     * Endpoint: /Auth/Register
     */
    register: async (username: string, email: string, password: string, fullName: string): Promise<LoginResponse> => {
        const data = await handleApiRequest<LoginResponse>(
            apiClient.post('/Auth/Register', {
                username,
                email,
                password,
                fullName
            })
        );

        const userWithCompatibility: User = {
            ...data.user,
            name: data.user.fullName || data.user.username || 'User'
        };

        useAuthStore.getState().login(userWithCompatibility, data.token);

        return {
            ...data,
            user: userWithCompatibility
        };
    },

    /**
     * Get current user profile
     * Endpoint: /Users/me
     */
    me: async (): Promise<User> => {
        const userDto = await handleApiRequest<User>(
            apiClient.get('/Users/me')
        );

        const userWithCompatibility: User = {
            ...userDto,
            name: userDto.fullName || userDto.username || 'User'
        };

        useAuthStore.getState().setUser(userWithCompatibility);
        return userWithCompatibility;
    },

    /**
     * Clear local authentication state
     */
    logout: async () => {
        useAuthStore.getState().logout();
    },
};

