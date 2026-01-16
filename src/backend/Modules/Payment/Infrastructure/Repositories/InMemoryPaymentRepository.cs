namespace Payment.Infrastructure.Repositories;

using Payment.Domain.Entities;
using Payment.Domain.Repositories;
using Payment.Domain.Enums;

public class InMemoryPaymentRepository : IPaymentRepository
{
    private readonly List<PaymentEntity> _payments = new();

    public Task<PaymentEntity?> GetPaymentByIdAsync(Guid paymentId)
    {
        var payment = _payments.FirstOrDefault(p => p.Id == paymentId);
        return Task.FromResult(payment);
    }

    public Task<IEnumerable<PaymentEntity>> GetPaymentsByUserIdAsync(Guid userId)
    {
        var payments = _payments.Where(p => p.UserId == userId).ToList();
        return Task.FromResult<IEnumerable<PaymentEntity>>(payments);
    }

    public Task AddPaymentAsync(PaymentEntity payment)
    {
        _payments.Add(payment);
        return Task.CompletedTask;
    }

    public Task UpdatePaymentAsync(Guid paymentId, PaymentStatus status)
    {
        var payment = _payments.FirstOrDefault(p => p.Id == paymentId);
        if (payment != null)
        {
            if (status == PaymentStatus.Completed)
                payment.MarkAsCompleted();
            else if (status == PaymentStatus.Failed)
                payment.MarkAsFailed();
        }
        return Task.CompletedTask;
    }
}
