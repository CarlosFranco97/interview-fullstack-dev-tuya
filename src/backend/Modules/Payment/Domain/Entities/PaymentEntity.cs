namespace Payment.Domain.Entities;

using Payment.Domain.Enums;
using Shared.Exceptions;

public class PaymentEntity
{
    public Guid Id { get; private set; }
    public Guid CardId { get; private set; }
    public Guid UserId { get; private set; }
    public decimal Amount { get; private set; }
    public string Description { get; private set; } = string.Empty;
    public DateTime PaymentDate { get; private set; }
    public PaymentStatus Status { get; private set; }

    private PaymentEntity() 
    {
        Id = Guid.Empty;
        CardId = Guid.Empty;
        UserId = Guid.Empty;
    }

    public PaymentEntity(Guid cardId, Guid userId, decimal amount, string description)
    {
        if (cardId == Guid.Empty)
            throw new DomainException("El ID de la tarjeta no puede estar vacío");
        
        if (userId == Guid.Empty)
            throw new DomainException("El ID del usuario no puede estar vacío");
            
        if (amount <= 0)
            throw new DomainException("El monto debe ser positivo");

        Id = Guid.NewGuid();
        CardId = cardId;
        UserId = userId;
        Amount = amount;
        Description = string.IsNullOrWhiteSpace(description) ? "Pago sin descripción" : description;
        PaymentDate = DateTime.UtcNow;
        Status = PaymentStatus.Pending;
    }

    public void MarkAsCompleted()
    {
        if (Status != PaymentStatus.Pending)
            throw new DomainException($"Cannot complete payment in {Status} status");
            
        Status = PaymentStatus.Completed;
    }

    public void MarkAsFailed()
    {
        if (Status != PaymentStatus.Pending)
            throw new DomainException($"Cannot fail payment in {Status} status");
            
        Status = PaymentStatus.Failed;
    }
}
