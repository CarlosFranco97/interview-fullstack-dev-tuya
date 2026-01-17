import { useEffect, useState, useCallback } from 'react';
import { getPaymentHistory } from '../api/paymentsApi';
import type { Payment } from '../types/paymentTypes';
import type { Card } from '@/features/cards/types/cardTypes';
import { getCards } from '@/features/cards/api/cardsApi';

/**
 * Custom hook to manage and fetch payment history along with associated card information.
 * 
 * @returns {Object} 
 * - payments: List of sorted payments.
 * - cards: List of user cards.
 * - isLoading: Loading state for both payments and cards.
 * - error: Error message if fetching fails.
 * - refresh: Function to re-fetch data.
 * - getCardInfo: Helper to find card details by ID.
 * - getCardNumberFormatted: Helper to get a masked card number by ID.
 */
export const usePayments = () => {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [cards, setCards] = useState<Card[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    /**
     * Fetches payments and cards in parallel and sorts payments by date.
     */
    const fetchData = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const [paymentsData, cardsData] = await Promise.all([
                getPaymentHistory(),
                getCards()
            ]);

            const sortedPayments = [...paymentsData].sort((a, b) =>
                new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime()
            );

            setPayments(sortedPayments);
            setCards(cardsData);
        } catch (err: unknown) {
            setError('No se pudieron cargar los datos de pagos');
            console.error('Error fetching payments data:', err instanceof Error ? err.message : err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    /**
     * Returns full card information for a given card ID.
     * @param {string} cardId - The card unique identifier.
     */
    const getCardInfo = (cardId: string) => {
        const card = cards.find(c => c.id === cardId);
        return card || null;
    };

    /**
     * Returns a formatted masked card number (e.g., **** 1234).
     * @param {string} cardId - The card unique identifier.
     */
    const getCardNumberFormatted = (cardId: string) => {
        const card = getCardInfo(cardId);
        if (!card) return 'Desconocida';
        const cardNumber = card.cardNumber || '';
        return `**** ${cardNumber.slice(-4)}`;
    };

    return {
        payments,
        cards,
        isLoading,
        error,
        refresh: fetchData,
        getCardInfo,
        getCardNumberFormatted
    };
};
