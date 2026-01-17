import { describe, it, expect } from 'vitest';
import { createCardSchema, editCardSchema } from './cardSchema';

describe('cardSchema', () => {
    describe('createCardSchema', () => {
        it('should validate a correct card creation object', () => {
            const validData = {
                holderName: 'Carlos Franco',
                creditLimit: 50000
            };
            const result = createCardSchema.safeParse(validData);
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.holderName).toBe('CARLOS FRANCO');
            }
        });

        it('should fail if holderName is too short', () => {
            const invalidData = {
                holderName: 'Ca',
                creditLimit: 50000
            };
            const result = createCardSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
        });

        it('should fail if creditLimit exceeds max value', () => {
            const invalidData = {
                holderName: 'Carlos Franco',
                creditLimit: 400000
            };
            const result = createCardSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
        });
    });

    describe('editCardSchema', () => {
        it('should allow partial updates', () => {
            const partialData = {
                creditLimit: 200000
            };
            const result = editCardSchema.safeParse(partialData);
            expect(result.success).toBe(true);
        });

        it('should validate holderName if provided', () => {
            const invalidData = {
                holderName: 'Ca'
            };
            const result = editCardSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
        });
    });
});
