namespace Payment.Application.DTOs;

public class PaymentDto
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public Guid CardId { get; set; }
    public decimal Amount { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime PaymentDate { get; set; }
    public string Description { get; set; } = string.Empty;
}

public class ProcessPaymentRequest
{
    public required Guid CardId { get; init; }
    public required decimal Amount { get; init; }
    public required string Description { get; init; }
}

public class ProcessPaymentResponse
{
    public Guid PaymentId { get; set; }
    public decimal Amount { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime PaymentDate { get; set; }
    public string Message { get; set; } = "Payment processed successfully";
}