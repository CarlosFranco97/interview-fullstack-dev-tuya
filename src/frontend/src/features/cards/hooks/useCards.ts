import { useState, useCallback, useEffect } from 'react';
import * as cardsApi from '../api/cardsApi';
import type { Card } from '../types/cardTypes';
import type { ApiError } from '@/types/apiTypes';

/**
 * Custom hook to manage the list of cards.
 * Handles fetching, error states, and deletion logic.
 */
export const useCards = () => {
    const [cards, setCards] = useState<Card[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCards = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await cardsApi.getCards();
            setCards(data);
        } catch (err) {
            const error = err as ApiError;
            setError(error.message || 'Error al cargar las tarjetas');
            console.error('Error fetching cards:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const deleteCard = async (id: string) => {
        if (!window.confirm('¿Estás seguro de que deseas eliminar esta tarjeta? Esta acción no se puede deshacer.')) {
            return false;
        }

        try {
            await cardsApi.deleteCard(id);
            await fetchCards();
            return true;
        } catch (err) {
            const error = err as ApiError;
            setError(error.message || 'Error al eliminar la tarjeta');
            console.error('Error deleting card:', error);
            return false;
        }
    };

    useEffect(() => {
        fetchCards();
    }, [fetchCards]);

    return {
        cards,
        isLoading,
        error,
        fetchCards,
        deleteCard
    };
};
