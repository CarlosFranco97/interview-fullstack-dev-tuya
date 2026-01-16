namespace Payment.Application.Services.Interfaces;

using Payment.Application.Commands;
using Payment.Application.DTOs;

public interface IPaymentService
{
    Task<PaymentDto> ProcessPaymentAsync(ProcessPaymentCommand command);
    Task<PaymentDto?> GetPaymentByIdAsync(Guid id);
    Task<IEnumerable<PaymentDto>> GetPaymentsByUserIdAsync(Guid userId);
}