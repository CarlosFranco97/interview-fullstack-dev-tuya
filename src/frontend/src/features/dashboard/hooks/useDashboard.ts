import { useNavigate } from 'react-router-dom';
import { usePayments } from '../../payments/hooks/usePayments';
import { ROUTES } from '@/constants';

/**
 * Custom hook to manage dashboard data and navigation.
 * Centralizes cards and payments fetching by leveraging usePayments.
 * 
 * @returns {Object} 
 * - cards: List of user cards.
 * - payments: List of recent payments.
 * - isLoading: Boolean indicating if data is being loaded.
 * - error: Error message if data fetching fails.
 * - mainCard: The primary card to display (first card).
 * - navigate: Navigation function.
 * - getCardNumberFormatted: Helper to get masked card number.
 */
export const useDashboard = () => {
    const navigate = useNavigate();
    const {
        payments,
        cards,
        isLoading,
        error,
        getCardNumberFormatted
    } = usePayments();

    const mainCard = cards.length > 0 ? cards[0] : null;

    return {
        cards,
        payments,
        isLoading,
        error,
        mainCard,
        navigate,
        getCardNumberFormatted,
        ROUTES
    };
};
