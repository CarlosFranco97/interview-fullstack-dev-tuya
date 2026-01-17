namespace Card.Application.Facades;

using AutoMapper;
using Shared.Facades;
using Card.Domain.Repositories;
using Card.Domain.Entities;
using Card.Domain.ValueObjects;
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

    public async Task<CardDetailDto?> GetCardDetailAsync(Guid cardId)
    {
        var card = await _cardRepository.GetByIdAsync(cardId);
        return card == null ? null : _mapper.Map<CardDetailDto>(card);
    }

    public async Task<IEnumerable<CardDetailDto>> GetUserCardsAsync(Guid userId)
    {
        var cards = await _cardRepository.GetCardsByUserIdAsync(userId);
        return _mapper.Map<IEnumerable<CardDetailDto>>(cards);
    }

    public async Task<Guid> CreateCardAsync(Guid userId, string holderName, decimal creditLimit)
    {
        var userCards = await _cardRepository.GetCardsByUserIdAsync(userId);
        var activeCardsCount = userCards.Count(c => c.Status == CardStatus.Active);
        
        if (activeCardsCount >= 3)
        {
            throw new InvalidOperationException("El usuario ha alcanzado el límite máximo de 3 tarjetas de crédito activas");
        }
        
        var cardNumber = await GenerateUniqueCardNumberAsync();
        var cardNumberVo = CardNumber.Create(cardNumber);
        var creditLimitMoney = Money.Create(creditLimit, "COP");
        
        var futureDate = DateTime.UtcNow.AddYears(5);
        var expirationDate = new DateTime(futureDate.Year, futureDate.Month, DateTime.DaysInMonth(futureDate.Year, futureDate.Month), 23, 59, 59, DateTimeKind.Utc);
        
        var card = new Card(userId, cardNumberVo, holderName, expirationDate, creditLimitMoney);
        card.Activate();
        
        await _cardRepository.AddAsync(card);
        return card.Id;
    }

    private async Task<string> GenerateUniqueCardNumberAsync()
    {
        const string BIN = "4532"; 
        const int maxAttempts = 100;
        
        for (int attempt = 0; attempt < maxAttempts; attempt++)
        {
            var cardNumber = GenerateCardNumberWithLuhn(BIN);
            
            var existing = await _cardRepository.GetByCardNumberAsync(cardNumber);
            if (existing == null)
            {
                return cardNumber;
            }
        }
        
        throw new InvalidOperationException("No se pudo generar un número de tarjeta único después de múltiples intentos");
    }

    private string GenerateCardNumberWithLuhn(string bin)
    {
        var random = new Random();
        var digits = bin;
        
        for (int i = 0; i < 11; i++)
        {
            digits += random.Next(0, 10).ToString();
        }
        
        var checkDigit = CalculateLuhnCheckDigit(digits);
        return digits + checkDigit;
    }

    private int CalculateLuhnCheckDigit(string partialNumber)
    {
        int sum = 0;
        bool alternate = true;
        
        for (int i = partialNumber.Length - 1; i >= 0; i--)
        {
            int digit = int.Parse(partialNumber[i].ToString());
            
            if (alternate)
            {
                digit *= 2;
                if (digit > 9) digit -= 9;
            }
            
            sum += digit;
            alternate = !alternate;
        }
        
        return (10 - (sum % 10)) % 10;
    }

    public async Task UpdateCardAsync(Guid cardId, string holderName, decimal creditLimit)
    {
        var card = await _cardRepository.GetByIdAsync(cardId);
        if (card == null)
            throw new NotFoundException($"Tarjeta con ID {cardId} no encontrada");

        card.UpdateHolderName(holderName);
        var newCreditLimit = Money.Create(creditLimit, "COP");
        card.UpdateCreditLimit(newCreditLimit);
        
        await _cardRepository.UpdateAsync(card);
    }

    public async Task DeleteCardAsync(Guid cardId)
    {
        var card = await _cardRepository.GetByIdAsync(cardId);
        if (card == null)
            throw new NotFoundException($"Tarjeta con ID {cardId} no encontrada");

        await _cardRepository.DeleteAsync(cardId);
    }

    public async Task<bool> HasSufficientBalanceAsync(Guid cardId, decimal amount)
    {
        var card = await _cardRepository.GetByIdAsync(cardId);
        if (card == null) return false;

        var requestedAmount = Money.Create(amount, "COP");
        return card.CanProcessTransaction() && card.Balance.IsGreaterThanOrEqual(requestedAmount);
    }

    public async Task DebitCardAsync(Guid cardId, decimal amount)
    {
        var card = await _cardRepository.GetByIdAsync(cardId);
        if (card == null)
            throw new NotFoundException($"Tarjeta con ID {cardId} no encontrada");

        var debitAmount = Money.Create(amount, "COP");
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
