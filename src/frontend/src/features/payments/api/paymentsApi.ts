import { paymentsService } from '../services/paymentsService';
import type { Payment } from '../types/paymentTypes';

/**
 * Payments Feature Facade
 * Provides a clean entry point for the UI/Hooks to interact with the payments feature.
 */

/**
 * Creates a new payment using the payments service.
 * @param data - The payment information.
 */
export const createPayment = (data: {
    cardId: string;
    amount: number;
    description: string;
}): Promise<Payment> => {
    return paymentsService.create(data);
};

/**
 * Retrieves the payment history.
 * Pagination has been removed as per requirements.
 */
export const getPaymentHistory = (): Promise<Payment[]> => {
    return paymentsService.getHistory();
};

/**
 * Retrieves a single payment by its ID.
 * @param id - The payment unique identifier.
 */
export const getPaymentById = (id: string): Promise<Payment> => {
    return paymentsService.getById(id);
};

