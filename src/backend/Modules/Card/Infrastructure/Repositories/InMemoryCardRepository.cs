namespace Card.Infrastructure.Repositories;

using CardEntity = Card.Domain.Entities.Card;
using Card.Domain.Repositories;

public class InMemoryCardRepository : ICardRepository
{
    private readonly List<CardEntity> _cards = new();

    public Task<CardEntity?> GetByIdAsync(Guid id)
    {
        var card = _cards.FirstOrDefault(c => c.Id == id);
        return Task.FromResult(card);
    }

    public Task<CardEntity?> GetByCardNumberAsync(string cardNumber)
    {
        var card = _cards.FirstOrDefault(c => c.CardNumber == cardNumber);
        return Task.FromResult(card);
    }

    public Task<IEnumerable<CardEntity>> GetAllAsync()
    {
        return Task.FromResult<IEnumerable<CardEntity>>(_cards);
    }

    public Task AddAsync(CardEntity card)
    {
        _cards.Add(card);
        return Task.CompletedTask;
    }

    public Task UpdateAsync(CardEntity card)
    {
        var existingCard = _cards.FirstOrDefault(c => c.Id == card.Id);
        if (existingCard != null)
        {
            _cards.Remove(existingCard);
            _cards.Add(card);
        }
        return Task.CompletedTask;
    }

    public Task<bool> ExistsAsync(string cardNumber)
    {
        var exists = _cards.Any(c => c.CardNumber == cardNumber);
        return Task.FromResult(exists);
    }
}
