namespace Card.Domain.Repositories;

using CardEntity = Entities.Card;

public interface ICardRepository
{
    Task<CardEntity?> GetByIdAsync(Guid id);
    Task<CardEntity?> GetByCardNumberAsync(string cardNumber);
    Task<IEnumerable<CardEntity>> GetAllAsync();
    Task<IEnumerable<CardEntity>> GetCardsByUserIdAsync(Guid userId);
    Task AddAsync(CardEntity card);
    Task UpdateAsync(CardEntity card);
    Task DeleteAsync(Guid id);
    Task<bool> ExistsAsync(string cardNumber);
}
