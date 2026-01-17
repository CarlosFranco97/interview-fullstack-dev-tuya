import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { usePayments } from './usePayments';
import * as paymentsApi from '../api/paymentsApi';
import * as cardsApi from '@/features/cards/api/cardsApi';

vi.mock('../api/paymentsApi', () => ({
    getPaymentHistory: vi.fn(),
}));

vi.mock('@/features/cards/api/cardsApi', () => ({
    getCards: vi.fn(),
}));

describe('usePayments hook', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should fetch payments and cards and sort them by date', async () => {
        const mockPayments = [
            { id: 'p1', paymentDate: '2026-01-01', amount: 50, cardId: 'c1' },
            { id: 'p2', paymentDate: '2026-01-02', amount: 100, cardId: 'c1' },
        ];
        const mockCards = [
            { id: 'c1', cardNumber: '**** 1234' }
        ];

        (paymentsApi.getPaymentHistory as any).mockResolvedValue(mockPayments);
        (cardsApi.getCards as any).mockResolvedValue(mockCards);

        const { result } = renderHook(() => usePayments());

        expect(result.current.isLoading).toBe(true);

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        expect(result.current.payments[0].id).toBe('p2');
        expect(result.current.payments[1].id).toBe('p1');
        expect(result.current.cards).toEqual(mockCards);
    });

    it('should provide card info helpers', async () => {
        const mockCards = [{ id: 'c1', cardNumber: '4532015112833663' }];
        (paymentsApi.getPaymentHistory as any).mockResolvedValue([]);
        (cardsApi.getCards as any).mockResolvedValue(mockCards);

        const { result } = renderHook(() => usePayments());

        await waitFor(() => expect(result.current.isLoading).toBe(false));

        const cardInfo = result.current.getCardInfo('c1');
        expect(cardInfo?.id).toBe('c1');

        const formattedNumber = result.current.getCardNumberFormatted('c1');
        expect(formattedNumber).toBe('**** 3663');

        expect(result.current.getCardNumberFormatted('non-existent')).toBe('Desconocida');
    });

    it('should handle errors', async () => {
        (paymentsApi.getPaymentHistory as any).mockRejectedValue(new Error('API Error'));
        (cardsApi.getCards as any).mockResolvedValue([]);

        const { result } = renderHook(() => usePayments());

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        expect(result.current.error).toBe('No se pudieron cargar los datos de pagos');
    });
});
