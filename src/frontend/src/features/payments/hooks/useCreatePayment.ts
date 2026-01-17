import { useState, useEffect, useCallback } from 'react';
import { useWatch, type Control, type UseFormSetValue } from 'react-hook-form';
import { createPayment } from '../api/paymentsApi';
import type { CreatePaymentForm } from '../schemas/paymentSchema';
import type { Card } from '@/features/cards/types/cardTypes';
import { getCards } from '@/features/cards/api/cardsApi';

/**
 * Custom hook to handle card payment creation logic and form synchronization.
 * 
 * @param {Control<CreatePaymentForm>} control - The control object from react-hook-form.
 * @param {UseFormSetValue<CreatePaymentForm>} setValue - The setValue function from react-hook-form.
 * 
 * @returns {Object} 
 * - cards: List of available active cards.
 * - isLoadingCards: Boolean indicating card loading state.
 * - serverError: Error message from the server or validation.
 * - setServerError: Function to manually update serverError.
 * - selectedCard: The card object currently selected in the form.
 * - watchedAmount: The current amount typed in the form.
 * - processPayment: Function to call the API with the payment data.
 */
export const useCreatePayment = (
    control: Control<CreatePaymentForm>,
    setValue: UseFormSetValue<CreatePaymentForm>
) => {
    const [cards, setCards] = useState<Card[]>([]);
    const [isLoadingCards, setIsLoadingCards] = useState(true);
    const [serverError, setServerError] = useState<string | null>(null);

    const watchedCardId = useWatch({ control, name: 'cardId' });
    const watchedAmount = useWatch({ control, name: 'amount' });

    const selectedCard = cards.find((c: Card) => c.id === watchedCardId);

    const loadCards = useCallback(async () => {
        try {
            setIsLoadingCards(true);
            const data = await getCards();
            const activeCards = data.filter(c => c.status !== 'blocked');
            setCards(activeCards);

            if (activeCards.length > 0 && !watchedCardId) {
                setValue('cardId', activeCards[0].id || '');
            }
        } catch (err) {
            console.error('Error al cargar tarjetas:', err);
            setServerError('Error al cargar tarjetas. Intenta nuevamente.');
        } finally {
            setIsLoadingCards(false);
        }
    }, [watchedCardId, setValue]);

    useEffect(() => {
        loadCards();
    }, [loadCards]);


    const processPayment = async (cardId: string, amount: number, description?: string) => {
        if (selectedCard && amount > (selectedCard.balance || 0)) {
            const errorMsg = `El monto no puede superar el saldo total actual (${selectedCard.balance})`;
            setServerError(errorMsg);
            throw new Error(errorMsg);
        }

        try {
            await createPayment({
                cardId,
                amount,
                description: description || ''
            });
        } catch (err: unknown) {
            const errorMsg = err instanceof Error ? err.message : 'Error al procesar el pago';
            setServerError(errorMsg);
            throw err;
        }
    };

    return {
        cards,
        isLoadingCards,
        serverError,
        setServerError,
        selectedCard,
        watchedAmount,
        processPayment
    };
};
