namespace Card.Application.Validators;

using FluentValidation;
using Card.Application.Commands;

public class UpdateCardCommandValidator : AbstractValidator<UpdateCardCommand>
{
    public UpdateCardCommandValidator()
    {
        RuleFor(x => x.CardId)
            .NotEmpty().WithMessage("El ID de la tarjeta es requerido");

        RuleFor(x => x.HolderName)
            .NotEmpty().WithMessage("El nombre del titular es requerido")
            .MinimumLength(3).WithMessage("El nombre del titular debe tener al menos 3 caracteres")
            .MaximumLength(100).WithMessage("El nombre del titular no puede exceder 100 caracteres");

        RuleFor(x => x.CreditLimit)
            .GreaterThan(0).WithMessage("El cupo de crédito debe ser positivo")
            .LessThanOrEqualTo(300000).WithMessage("El cupo de crédito no puede exceder $300,000 COP");
    }
}

public class ActivateCardCommandValidator : AbstractValidator<ActivateCardCommand>
{
    public ActivateCardCommandValidator()
    {
        RuleFor(x => x.CardId)
            .NotEmpty().WithMessage("Card ID is required");
    }
}

public class BlockCardCommandValidator : AbstractValidator<BlockCardCommand>
{
    public BlockCardCommandValidator()
    {
        RuleFor(x => x.CardId)
            .NotEmpty().WithMessage("Card ID is required");
    }
}

public class CreditCardCommandValidator : AbstractValidator<CreditCardCommand>
{
    public CreditCardCommandValidator()
    {
        RuleFor(x => x.CardId)
            .NotEmpty().WithMessage("Card ID is required");

        RuleFor(x => x.Amount)
            .GreaterThan(0).WithMessage("Amount must be positive")
            .LessThanOrEqualTo(50000).WithMessage("Cannot credit more than $50,000 at once");
    }
}
