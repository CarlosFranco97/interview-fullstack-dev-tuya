namespace Card.Application.Commands;

public record CreateCardCommand
{
    public Guid UserId { get; set; }
    public string CardNumber { get; set; } = null!;
    public string HolderName { get; set; } = null!;
    public DateTime ExpirationDate { get; set; }
    public decimal CreditLimit { get; set; }
}
