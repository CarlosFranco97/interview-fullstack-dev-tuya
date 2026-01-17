import { renderHook, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useCards } from './useCards';
import * as cardsApi from '../api/cardsApi';

// Mock the entire cardsApi module
vi.mock('../api/cardsApi', () => ({
    getCards: vi.fn(),
    deleteCard: vi.fn(),
}));

describe('useCards hook', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should fetch cards and handle loading state', async () => {
        const mockCards = [
            { id: '1', cardNumber: '**** 1234', holderName: 'Test', balance: 100, creditLimit: 500, status: 'Active' }
        ];

        (cardsApi.getCards as any).mockResolvedValue(mockCards);

        const { result } = renderHook(() => useCards());

        expect(result.current.isLoading).toBe(true);
        expect(result.current.cards).toEqual([]);

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        expect(result.current.cards).toEqual(mockCards);
        expect(result.current.error).toBeNull();
    });

    it('should handle API errors', async () => {
        (cardsApi.getCards as any).mockRejectedValue({ message: 'Error de servidor' });

        const { result } = renderHook(() => useCards());

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        expect(result.current.error).toBe('Error de servidor');
        expect(result.current.cards).toEqual([]);
    });

    it('should delete card and refresh list', async () => {
        const mockCards = [{ id: '1', cardNumber: '1234' }];
        (cardsApi.getCards as any).mockResolvedValue(mockCards);
        (cardsApi.deleteCard as any).mockResolvedValue(undefined);

        const { result } = renderHook(() => useCards());

        await waitFor(() => expect(result.current.isLoading).toBe(false));

        let success;
        await act(async () => {
            success = await result.current.deleteCard('1');
        });

        expect(cardsApi.deleteCard).toHaveBeenCalledWith('1');
        expect(success).toBe(true);
    });
});
