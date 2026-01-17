import { useState, useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams } from 'react-router-dom';
import * as cardsApi from '../api/cardsApi';
import { editCardSchema, type EditCardForm } from '../schemas/cardSchema';
import { ROUTES } from '@/constants';
import type { Card } from '../types/cardTypes';
import type { ApiError } from '@/types/apiTypes';

/**
 * Custom hook to manage editing an existing card.
 */
export const useEditCard = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [isLoading, setIsLoading] = useState(true);
    const [card, setCard] = useState<Card | null>(null);
    const [serverError, setServerError] = useState<string | null>(null);

    const form = useForm<EditCardForm>({
        resolver: zodResolver(editCardSchema) as any,
    });

    const watchedLimit = useWatch({
        control: form.control,
        name: 'creditLimit'
    });

    useEffect(() => {
        const loadCard = async () => {
            if (!id) return;
            try {
                setIsLoading(true);
                const data = await cardsApi.getCardById(id);
                setCard(data);
                form.reset({
                    holderName: data.holderName,
                    creditLimit: data.creditLimit,
                });
            } catch (err) {
                const error = err as ApiError;
                setServerError(error.message);
            } finally {
                setIsLoading(false);
            }
        };
        loadCard();
    }, [id, form]);

    const onSubmit = async (data: EditCardForm) => {
        if (!id) return;
        try {
            setServerError(null);
            await cardsApi.updateCard(id, {
                holderName: data.holderName,
                creditLimit: Number(data.creditLimit),
            });
            navigate(ROUTES.CARDS);
        } catch (err) {
            const error = err as ApiError;
            setServerError(error.message);
        }
    };

    const currentDebt = card ? card.creditLimit - (card.balance || 0) : 0;
    const isLimitTooLow = Number(watchedLimit || 0) < currentDebt;

    return {
        card,
        form,
        isLoading,
        serverError,
        onSubmit: form.handleSubmit(onSubmit),
        navigate,
        isLimitTooLow,
        currentDebt
    };
};
