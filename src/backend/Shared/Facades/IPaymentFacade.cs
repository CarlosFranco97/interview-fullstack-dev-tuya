namespace Shared.Facades;

public interface IPaymentFacade
{
    Task<decimal> GetTotalPaymentsByUserAsync(Guid userId);
    Task<bool> PaymentExistsAsync(Guid paymentId);
}
