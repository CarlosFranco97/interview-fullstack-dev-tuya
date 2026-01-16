namespace Payment.Domain.Repositories;

using Payment.Domain.Entities;
using Payment.Domain.Enums;

public interface IPaymentRepository
{
    Task<PaymentEntity?> GetPaymentByIdAsync(Guid paymentId);
    Task<IEnumerable<PaymentEntity>> GetPaymentsByUserIdAsync(Guid userId);
    Task AddPaymentAsync(PaymentEntity payment);
    Task UpdatePaymentAsync(Guid paymentId, PaymentStatus status);
}
