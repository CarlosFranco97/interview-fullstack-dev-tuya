namespace Card.Application.Commands;

public record UpdateCardCommand
{
    public Guid CardId { get; set; }
    public string HolderName { get; set; } = null!;
    public DateTime ExpirationDate { get; set; }
}

public record ActivateCardCommand
{
    public Guid CardId { get; set; }
}

public record BlockCardCommand
{
    public Guid CardId { get; set; }
}

public record CreditCardCommand
{
    public Guid CardId { get; set; }
    public decimal Amount { get; set; }
}
