import { z } from 'zod';

/**
 * Schema for creating a new card.
 * holderName is required and must be at least 3 characters.
 * creditLimit has a maximum allowed value for security/business rules.
 */
export const createCardSchema = z.object({
    holderName: z.string()
        .min(3, 'El nombre es muy corto')
        .transform(val => val.toUpperCase()),
    creditLimit: z.coerce.number()
        .min(0, 'El cupo debe ser positivo')
        .max(300000, 'El cupo debe ser menor a 300,000')
});

/**
 * Schema for updating an existing card.
 * Allows partial updates for holderName and creditLimit.
 */
export const editCardSchema = z.object({
    holderName: z.string()
        .min(3, 'El nombre es muy corto')
        .transform(val => val.toUpperCase())
        .optional(),
    creditLimit: z.coerce.number()
        .min(0, 'El cupo debe ser positivo')
        .max(30000000, 'El cupo es muy alto')
        .optional(),
});

export type CreateCardForm = z.infer<typeof createCardSchema>;
export type EditCardForm = z.infer<typeof editCardSchema>;

