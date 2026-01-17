namespace Payment.Application.Validators;

using FluentValidation;
using Payment.Application.Commands;

public class ProcessPaymentCommandValidator : AbstractValidator<ProcessPaymentCommand>
{
    public ProcessPaymentCommandValidator()
    {
        RuleFor(x => x.CardId)
            .NotEmpty().WithMessage("El ID de la tarjeta es requerido");

        RuleFor(x => x.Amount)
            .GreaterThan(0).WithMessage("El monto debe ser positivo");
    }
}