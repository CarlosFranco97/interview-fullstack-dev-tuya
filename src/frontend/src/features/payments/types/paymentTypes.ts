import type { Card } from '../../cards/types/cardTypes';

/**
 * Represents a payment transaction.
 * Includes optional card details for history views.
 */
export interface Payment {
    id: string;
    cardId: string;
    amount: number;
    description: string;
    status: string;
    paymentDate: string;
    card?: Card;
}
