import { z } from 'zod';

/**
 * Zod validation schema for the payment creation form.
 * 
 * Validates:
 * - cardId: Must be a non-empty string.
 * - amount: Must be a number greater than 0 and less than or equal to 10,000,000.
 * - description: Optional string.
 */
export const createPaymentSchema = z.object({
    cardId: z.string().min(1, 'Debes seleccionar una tarjeta'),
    amount: z.number().min(1, 'El monto debe ser mayor a 0').max(10000000, 'Monto máximo excedido'),
    description: z.string().optional()
});

/**
 * TypeScript type inferred from the createPaymentSchema.
 */
export type CreatePaymentForm = z.infer<typeof createPaymentSchema>;
