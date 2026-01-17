import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import * as cardsApi from '../api/cardsApi';
import { createCardSchema, type CreateCardForm } from '../schemas/cardSchema';
import { useAuthStore } from '@/store/authStore';
import { ROUTES } from '@/constants';
import type { ApiError } from '@/types/apiTypes';

/**
 * Custom hook to manage the creation of a new card.
 * Handles eligibility checks, form submission, and navigation.
 */
export const useCreateCard = () => {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const [serverError, setServerError] = useState<string | null>(null);
    const [isCheckingEligibility, setIsCheckingEligibility] = useState(true);

    const form = useForm<CreateCardForm>({
        resolver: zodResolver(createCardSchema) as any,
        defaultValues: {
            holderName: user?.name?.toUpperCase() || '',
            creditLimit: 1000000,
        }
    });


    useEffect(() => {
        const checkEligibility = async () => {
            try {
                const cards = await cardsApi.getCards();
                if (cards.length >= 3) {
                    navigate(ROUTES.CARDS, { replace: true });
                }
            } catch (error) {
                console.error('Error checking eligibility:', error);
            } finally {
                setIsCheckingEligibility(false);
            }
        };

        checkEligibility();
    }, [navigate]);

    const onSubmit = async (data: CreateCardForm) => {
        try {
            setServerError(null);
            if (!user?.id) throw new Error("Usuario no autenticado");

            const today = new Date();
            const expiryDate = new Date(today.setFullYear(today.getFullYear() + 5));

            await cardsApi.createCard({
                holderName: data.holderName,
                expirationDate: expiryDate.toISOString(),
                creditLimit: Number(data.creditLimit),
                cvv: '000'
            });

            navigate(ROUTES.CARDS);
        } catch (err) {
            const error = err as ApiError;
            console.error('Error creating card:', error);
            setServerError(error.message || 'Error al crear la tarjeta');
        }
    };

    return {
        form,
        isCheckingEligibility,
        serverError,
        onSubmit: form.handleSubmit(onSubmit),
        navigate
    };
};
