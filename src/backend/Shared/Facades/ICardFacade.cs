namespace Shared.Facades;

public class CardSummaryDto
{
    public Guid Id { get; set; }
    public string CardNumber { get; set; } = null!;
    public decimal Balance { get; set; }
    public string Status { get; set; } = null!;
}

public interface ICardFacade
{
    Task<CardSummaryDto?> GetCardSummaryAsync(Guid cardId);
    Task<bool> HasSufficientBalanceAsync(Guid cardId, decimal amount);
    Task DebitCardAsync(Guid cardId, decimal amount);
    Task<bool> CardExistsAsync(Guid cardId);
    Task<bool> CardBelongsToUserAsync(Guid cardId, Guid userId);
}
