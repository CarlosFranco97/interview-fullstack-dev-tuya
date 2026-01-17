/**
 * Represents a credit or debit card in the system.
 */
export interface Card {
    id?: string;
    userId: string;
    cardNumber: string;
    holderName: string;
    expirationDate: string;
    cvv?: string;
    creditLimit: number;
    balance?: number;
    status?: 'active' | 'blocked';
}
