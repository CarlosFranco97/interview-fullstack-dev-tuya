namespace Infrastructure.Repositories;

using Microsoft.EntityFrameworkCore;
using Infrastructure.Data;
using Card.Domain.Entities;
using Card.Domain.Repositories;
using Shared.Domain.ValueObjects;

public class CardRepository : ICardRepository
{
    private readonly AppDbContext _context;

    public CardRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Card?> GetByIdAsync(Guid id)
    {
        return await _context.Cards.FindAsync(id);
    }

    public async Task<Card?> GetByCardNumberAsync(string cardNumber)
    {
        return await _context.Cards
            .FirstOrDefaultAsync(c => EF.Property<string>(c, "_cardNumber") == cardNumber);
    }

    public async Task<IEnumerable<Card>> GetAllAsync()
    {
        return await _context.Cards.ToListAsync();
    }

    public async Task<IEnumerable<Card>> GetCardsByUserIdAsync(Guid userId)
    {
        return await _context.Cards
            .Where(c => c.UserId == userId)
            .ToListAsync();
    }

    public async Task AddAsync(Card card)
    {
        await _context.Cards.AddAsync(card);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(Card card)
    {
        _context.Cards.Update(card);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Guid id)
    {
        var card = await _context.Cards.FindAsync(id);
        if (card != null)
        {
            _context.Cards.Remove(card);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<bool> CardBelongsToUserAsync(Guid cardId, Guid userId)
    {
        return await _context.Cards
            .AnyAsync(c => c.Id == cardId && c.UserId == userId);
    }

    public async Task<decimal> GetCardBalanceAsync(Guid cardId)
    {
        var card = await _context.Cards.FindAsync(cardId);
        return card?.Balance.Amount ?? 0;
    }

    public async Task<bool> ExistsAsync(string cardNumber)
    {
        return await _context.Cards.AnyAsync(c => EF.Property<string>(c, "_cardNumber") == cardNumber);
    }
}
