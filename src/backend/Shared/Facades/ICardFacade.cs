namespace Shared.Facades;

public class CardSummaryDto
{
    public Guid Id { get; set; }
    public string CardNumber { get; set; } = null!;
    public decimal Balance { get; set; }
    public string Status { get; set; } = null!;
}

public class CardDetailDto
{
    public Guid Id { get; set; }
    public string CardNumber { get; set; } = null!;
    public string HolderName { get; set; } = null!;
    public DateTime ExpirationDate { get; set; }
    public decimal Balance { get; set; }
    public decimal CreditLimit { get; set; }
    public string Status { get; set; } = null!;
    public DateTime CreatedAt { get; set; }
}

public interface ICardFacade
{
    Task<CardSummaryDto?> GetCardSummaryAsync(Guid cardId);
    Task<CardDetailDto?> GetCardDetailAsync(Guid cardId);
    Task<IEnumerable<CardDetailDto>> GetUserCardsAsync(Guid userId);
    Task<Guid> CreateCardAsync(Guid userId, string holderName, decimal creditLimit);
    Task UpdateCardAsync(Guid cardId, string holderName, decimal creditLimit);
    Task DeleteCardAsync(Guid cardId);
    Task<bool> HasSufficientBalanceAsync(Guid cardId, decimal amount);
    Task DebitCardAsync(Guid cardId, decimal amount);
    Task<bool> CardExistsAsync(Guid cardId);
    Task<bool> CardBelongsToUserAsync(Guid cardId, Guid userId);
}
