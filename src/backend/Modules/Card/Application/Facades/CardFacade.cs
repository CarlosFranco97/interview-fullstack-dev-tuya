namespace Card.Application.Facades;

using AutoMapper;
using Shared.Facades;
using Card.Domain.Repositories;
using Shared.Domain.ValueObjects;
using Shared.Exceptions;

public class CardFacade : ICardFacade
{
    private readonly ICardRepository _cardRepository;
    private readonly IMapper _mapper;

    public CardFacade(ICardRepository cardRepository, IMapper mapper)
    {
        _cardRepository = cardRepository;
        _mapper = mapper;
    }

    public async Task<CardSummaryDto?> GetCardSummaryAsync(Guid cardId)
    {
        var card = await _cardRepository.GetByIdAsync(cardId);
        return card == null ? null : _mapper.Map<CardSummaryDto>(card);
    }

    public async Task<bool> HasSufficientBalanceAsync(Guid cardId, decimal amount)
    {
        var card = await _cardRepository.GetByIdAsync(cardId);
        if (card == null) return false;

        var requestedAmount = Money.Create(amount, "MXN");
        return card.CanProcessTransaction() && card.Balance.IsGreaterThanOrEqual(requestedAmount);
    }

    public async Task DebitCardAsync(Guid cardId, decimal amount)
    {
        var card = await _cardRepository.GetByIdAsync(cardId);
        if (card == null)
            throw new NotFoundException($"Card with ID {cardId} not found");

        var debitAmount = Money.Create(amount, "MXN");
        card.Debit(debitAmount);
        await _cardRepository.UpdateAsync(card);
    }

    public async Task<bool> CardExistsAsync(Guid cardId)
    {
        var card = await _cardRepository.GetByIdAsync(cardId);
        return card != null;
    }

    public async Task<bool> CardBelongsToUserAsync(Guid cardId, Guid userId)
    {
        var card = await _cardRepository.GetByIdAsync(cardId);
        return card != null && card.UserId == userId;
    }
}
