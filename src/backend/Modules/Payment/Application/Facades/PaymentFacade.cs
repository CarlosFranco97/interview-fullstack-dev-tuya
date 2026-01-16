namespace Payment.Application.Facades;

using AutoMapper;
using Shared.Facades;
using Payment.Domain.Repositories;
using Payment.Domain.Enums;

public class PaymentFacade : IPaymentFacade
{
    private readonly IPaymentRepository _paymentRepository;
    private readonly IMapper _mapper;

    public PaymentFacade(IPaymentRepository paymentRepository, IMapper mapper)
    {
        _paymentRepository = paymentRepository;
        _mapper = mapper;
    }

    // Método que otros módulos pueden llamar
    public async Task<decimal> GetTotalPaymentsByUserAsync(Guid userId)
    {
        var payments = await _paymentRepository.GetPaymentsByUserIdAsync(userId);
        return payments
            .Where(p => p.Status == PaymentStatus.Completed)
            .Sum(p => p.Amount);
    }

    public async Task<bool> PaymentExistsAsync(Guid paymentId)
    {
        var payment = await _paymentRepository.GetPaymentByIdAsync(paymentId);
        return payment != null;
    }
}