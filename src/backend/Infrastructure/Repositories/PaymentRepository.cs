namespace Infrastructure.Repositories;

using Microsoft.EntityFrameworkCore;
using Infrastructure.Data;
using Payment.Domain.Entities;
using Payment.Domain.Repositories;
using Payment.Domain.Enums;

public class PaymentRepository : IPaymentRepository
{
    private readonly AppDbContext _context;

    public PaymentRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<PaymentEntity?> GetPaymentByIdAsync(Guid paymentId)
    {
        return await _context.Payments.FindAsync(paymentId);
    }

    public async Task<IEnumerable<PaymentEntity>> GetPaymentsByUserIdAsync(Guid userId)
    {
        return await _context.Payments
            .Where(p => p.UserId == userId)
            .OrderByDescending(p => p.PaymentDate)
            .ToListAsync();
    }

    public async Task AddPaymentAsync(PaymentEntity payment)
    {
        await _context.Payments.AddAsync(payment);
        await _context.SaveChangesAsync();
    }

    public async Task UpdatePaymentAsync(Guid paymentId, PaymentStatus status)
    {
        var payment = await _context.Payments.FindAsync(paymentId);
        if (payment != null)
        {
            if (status == PaymentStatus.Completed)
                payment.MarkAsCompleted();
            else if (status == PaymentStatus.Failed)
                payment.MarkAsFailed();
            
            _context.Payments.Update(payment);
            await _context.SaveChangesAsync();
        }
    }
}
