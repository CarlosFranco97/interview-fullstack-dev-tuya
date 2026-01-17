import { apiClient } from '../../../api/axiosConfig';
import { handleApiRequest } from '../../../api/apiHelper';
import type { Payment } from '../types/paymentTypes';

interface CreatePaymentData {
    cardId: string;
    amount: number;
    description: string;
}

/**
 * Payment Service - Handles direct API consumption for the payments feature.
 */
export const paymentsService = {
    /**
     * Creates a new payment.
     */
    create: async (paymentData: CreatePaymentData): Promise<Payment> => {
        return handleApiRequest<Payment>(
            apiClient.post('/Payments', paymentData)
        );
    },

    /**
     * Retrieves payment history.
     */
    getHistory: async (): Promise<Payment[]> => {
        return handleApiRequest<Payment[]>(
            apiClient.get('/Payments')
        );
    },

    /**
     * Gets a payment by ID.
     */
    getById: async (id: string): Promise<Payment> => {
        return handleApiRequest<Payment>(
            apiClient.get(`/Payments/${id}`)
        );
    },
};



