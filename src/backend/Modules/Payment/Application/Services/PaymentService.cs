namespace Payment.Application.Services;

using AutoMapper;
using Payment.Application.Commands;
using Payment.Application.DTOs;
using Payment.Application.Services.Interfaces;
using Payment.Domain.Repositories;
using Shared.Facades;
using Shared.Exceptions;

public class PaymentService : IPaymentService
{
    private readonly IPaymentRepository _paymentRepository;
    private readonly ICardFacade _cardFacade;  
    private readonly IUserFacade _userFacade;  
    private readonly IMapper _mapper;

    public PaymentService(
        IPaymentRepository paymentRepository,
        ICardFacade cardFacade,
        IUserFacade userFacade,
        IMapper mapper)
    {
        _paymentRepository = paymentRepository;
        _cardFacade = cardFacade;
        _userFacade = userFacade;
        _mapper = mapper;
    }

    public async Task<PaymentDto> ProcessPaymentAsync(ProcessPaymentCommand command)
    {
        var userExists = await _userFacade.UserExistsAsync(command.UserId);
        if (!userExists)
            throw new NotFoundException($"User {command.UserId} not found");

        var cardBelongsToUser = await _cardFacade.CardBelongsToUserAsync(command.CardId, command.UserId);
        if (!cardBelongsToUser)
            throw new DomainException("Card does not belong to user");

        var hasSufficientBalance = await _cardFacade.HasSufficientBalanceAsync(command.CardId, command.Amount);
        if (!hasSufficientBalance)
            throw new DomainException("Insufficient balance");

        await _cardFacade.DebitCardAsync(command.CardId, command.Amount);

        var payment = new Domain.Entities.PaymentEntity(
            command.CardId, 
            command.UserId, 
            command.Amount, 
            command.Description
        );
        
        payment.MarkAsCompleted();

        await _paymentRepository.AddPaymentAsync(payment);

        return _mapper.Map<PaymentDto>(payment);
    }

    public async Task<PaymentDto?> GetPaymentByIdAsync(Guid id)
    {
        var payment = await _paymentRepository.GetPaymentByIdAsync(id);
        return payment == null ? null : _mapper.Map<PaymentDto>(payment);
    }

    public async Task<IEnumerable<PaymentDto>> GetPaymentsByUserIdAsync(Guid userId)
    {
        var payments = await _paymentRepository.GetPaymentsByUserIdAsync(userId);
        return _mapper.Map<IEnumerable<PaymentDto>>(payments);
    }
}