import { cardsService, type CreateCardDto, type UpdateCardDto } from '../services/cardsService';

/**
 * Cards API Facade
 * Provides a clean interface for hooks to interact with the cards service.
 */

export const getCards = () => cardsService.getAll();

export const getCardById = (id: string) => cardsService.getById(id);

export const createCard = (data: CreateCardDto) => cardsService.create(data);

export const updateCard = (id: string, data: UpdateCardDto) => cardsService.update(id, data);

export const deleteCard = (id: string) => cardsService.delete(id);
