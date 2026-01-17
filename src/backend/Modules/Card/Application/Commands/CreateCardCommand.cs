namespace Card.Application.Commands;

public record CreateCardCommand
{
    public Guid UserId { get; set; }
    public string HolderName { get; set; } = null!;
    public decimal CreditLimit { get; set; }
}
