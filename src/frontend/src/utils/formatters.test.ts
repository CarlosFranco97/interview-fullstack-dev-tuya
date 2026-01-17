import { describe, it, expect } from 'vitest';
import { formatCurrency, maskCardNumber } from './formatters';

describe('formatters', () => {
    describe('formatCurrency', () => {
        it('should format numbers correctly', () => {
            const result = formatCurrency(100000);
            const cleanResult = result.replace(/\s/g, ' ');
            expect(cleanResult).toContain('100.000');
            expect(cleanResult).toMatch(/[\$|COP]/);
        });
    });

    describe('maskCardNumber', () => {
        it('should mask card numbers except the last 4 digits', () => {
            const cardNumber = '4532015112833663';
            const result = maskCardNumber(cardNumber);
            expect(result).toBe('**** **** **** 3663');
        });

        it('should return original string if shorter than 4 characters', () => {
            expect(maskCardNumber('123')).toBe('123');
        });
    });
});
