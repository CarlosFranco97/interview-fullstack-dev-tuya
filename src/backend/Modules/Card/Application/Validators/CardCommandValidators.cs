namespace Card.Application.Validators;

using FluentValidation;
using Card.Application.Commands;

public class UpdateCardCommandValidator : AbstractValidator<UpdateCardCommand>
{
    public UpdateCardCommandValidator()
    {
        RuleFor(x => x.CardId)
            .NotEmpty().WithMessage("Card ID is required");

        RuleFor(x => x.HolderName)
            .NotEmpty().WithMessage("Holder name is required")
            .MinimumLength(3).WithMessage("Holder name must be at least 3 characters")
            .MaximumLength(100).WithMessage("Holder name cannot exceed 100 characters");

        RuleFor(x => x.ExpirationDate)
            .GreaterThan(DateTime.UtcNow).WithMessage("Expiration date must be in the future");
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
