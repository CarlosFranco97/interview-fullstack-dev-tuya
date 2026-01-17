namespace Card.Application.Validators;

using FluentValidation;
using Card.Application.Commands;

public class CreateCardCommandValidator : AbstractValidator<CreateCardCommand>
{
    public CreateCardCommandValidator()
    {
        RuleFor(x => x.UserId)
            .NotEmpty().WithMessage("El ID de usuario es requerido");

        RuleFor(x => x.HolderName)
            .NotEmpty().WithMessage("El nombre del titular es requerido")
            .MinimumLength(3).WithMessage("El nombre del titular debe tener al menos 3 caracteres")
            .MaximumLength(100).WithMessage("El nombre del titular no puede exceder 100 caracteres");

        RuleFor(x => x.CreditLimit)
            .GreaterThan(0).WithMessage("El cupo de crédito debe ser positivo")
            .LessThanOrEqualTo(300000).WithMessage("El cupo de crédito no puede exceder $300,000 COP");
    }
}
