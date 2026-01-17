import { apiClient } from '@/api/axiosConfig';
import { handleApiRequest } from '@/api/apiHelper';
import type { Card } from '../types/cardTypes';

/**
 * DTO for creating a card (matching Backend expectations)
 */
export interface CreateCardDto {
    holderName: string;
    expirationDate: string;
    creditLimit: number;
    cvv: string;
}

/**
 * DTO for updating a card
 */
export interface UpdateCardDto {
    holderName?: string;
    creditLimit?: number;
}

/**
 * Cards Service - Handles all API interactions for the cards feature.
 */
export const cardsService = {
    /**
     * Retrieves all cards for the authenticated user.
     * @returns Promise with an array of cards.
     */
    getAll: () =>
        handleApiRequest<Card[]>(
            apiClient.get('/Cards')
        ),

    /**
     * Retrieves a single card by its unique identifier.
     * @param id - The card ID.
     * @returns Promise with the card data.
     */
    getById: (id: string) =>
        handleApiRequest<Card>(
            apiClient.get(`/Cards/${id}`)
        ),

    /**
     * Creates a new card for the authenticated user.
     * @param cardData - The card details to create.
     * @returns Promise with the created card.
     */
    create: (cardData: CreateCardDto) =>
        handleApiRequest<Card>(
            apiClient.post('/Cards', cardData)
        ),

    /**
     * Updates an existing card's information.
     * @param id - The card ID.
     * @param cardData - The partial card data to update.
     * @returns Promise with the updated card.
     */
    update: (id: string, cardData: UpdateCardDto) =>
        handleApiRequest<Card>(
            apiClient.put(`/Cards/${id}`, cardData)
        ),

    /**
     * Deletes a card by its ID.
     * @param id - The card ID.
     * @returns Promise indicating completion.
     */
    delete: (id: string) =>
        handleApiRequest<{ message: string }>(
            apiClient.delete(`/Cards/${id}`)
        ),
};
