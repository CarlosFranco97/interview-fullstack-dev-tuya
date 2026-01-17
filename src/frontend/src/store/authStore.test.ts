import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAuthStore } from './authStore';

describe('authStore', () => {
    beforeEach(() => {
        useAuthStore.getState().logout();
        localStorage.clear();
        vi.clearAllMocks();
    });

    it('should have initial state', () => {
        const state = useAuthStore.getState();
        expect(state.user).toBeNull();
        expect(state.token).toBeNull();
        expect(state.isAuthenticated).toBe(false);
    });

    it('should update state on login', () => {
        const mockUser = {
            id: '123',
            username: 'testuser',
            email: 'test@example.com',
            fullName: 'Test User',
            createdAt: '2026-01-01',
            isActive: true,
            name: 'Test'
        };
        const mockToken = 'fake-token';

        useAuthStore.getState().login(mockUser, mockToken);

        const state = useAuthStore.getState();
        expect(state.user).toEqual(mockUser);
        expect(state.token).toBe(mockToken);
        expect(state.isAuthenticated).toBe(true);

        expect(localStorage.getItem('token')).toBe(mockToken);
        expect(JSON.parse(localStorage.getItem('user') || '{}')).toEqual(mockUser);
    });

    it('should clear state on logout', () => {
        const mockUser = { id: '123', username: 'test', email: '', fullName: '', createdAt: '', isActive: true, name: '' };
        useAuthStore.getState().login(mockUser, 'token');

        useAuthStore.getState().logout();

        const state = useAuthStore.getState();
        expect(state.user).toBeNull();
        expect(state.token).toBeNull();
        expect(state.isAuthenticated).toBe(false);
        expect(localStorage.getItem('token')).toBeNull();
    });

    it('should set loading state', () => {
        useAuthStore.getState().setLoading(true);
        expect(useAuthStore.getState().isLoading).toBe(true);

        useAuthStore.getState().setLoading(false);
        expect(useAuthStore.getState().isLoading).toBe(false);
    });
});
