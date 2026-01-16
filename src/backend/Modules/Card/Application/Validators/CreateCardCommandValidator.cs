namespace Card.Application.Validators;

using FluentValidation;
using Card.Application.Commands;

public class CreateCardCommandValidator : AbstractValidator<CreateCardCommand>
{
    public CreateCardCommandValidator()
    {
        RuleFor(x => x.UserId)
            .NotEmpty().WithMessage("User ID is required");

        RuleFor(x => x.CardNumber)
            .NotEmpty().WithMessage("Card number is required")
            .Length(16).WithMessage("Card number must be 16 digits")
            .Matches(@"^\d+$").WithMessage("Card number must contain only digits");

        RuleFor(x => x.HolderName)
            .NotEmpty().WithMessage("Holder name is required")
            .MinimumLength(3).WithMessage("Holder name must be at least 3 characters")
            .MaximumLength(100).WithMessage("Holder name cannot exceed 100 characters");

        RuleFor(x => x.ExpirationDate)
            .GreaterThan(DateTime.UtcNow).WithMessage("Expiration date must be in the future");

        RuleFor(x => x.CreditLimit)
            .GreaterThan(0).WithMessage("Credit limit must be positive")
            .LessThanOrEqualTo(100000).WithMessage("Credit limit cannot exceed $100,000");
    }
}
