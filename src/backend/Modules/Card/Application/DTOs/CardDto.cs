namespace Card.Application.DTOs;

public class CardDto
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public required string CardNumber { get; set; }
    public required string HolderName { get; set; }
    public DateTime ExpirationDate { get; set; }
    public decimal Balance { get; set; }
    public decimal CreditLimit { get; set; }
    public required string Status { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreateCardRequest
{
    public Guid UserId { get; set; }
    public required string CardNumber { get; set; }
    public required string HolderName { get; set; }
    public DateTime ExpirationDate { get; set; }
    public decimal CreditLimit { get; set; }
}

public class UpdateCardRequest
{
    public required string HolderName { get; set; }
    public DateTime ExpirationDate { get; set; }
}

public class CreditCardRequest
{
    public decimal Amount { get; set; }
}
