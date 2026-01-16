namespace Payment.Application.Commands;

public record ProcessPaymentCommand
{
    public Guid UserId {get; set; }
    public Guid CardId { get; set; }
    public decimal Amount { get; set; }
    public string Description {get; init;} = string.Empty;
}