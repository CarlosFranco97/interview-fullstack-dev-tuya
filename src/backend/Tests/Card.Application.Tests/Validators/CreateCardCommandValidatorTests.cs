namespace Card.Application.Tests.Validators;

using Card.Application.Commands;
using Card.Application.Validators;
using FluentAssertions;
using FluentValidation.TestHelper;
using Xunit;

public class CreateCardCommandValidatorTests
{
    private readonly CreateCardCommandValidator _validator;

    public CreateCardCommandValidatorTests()
    {
        _validator = new CreateCardCommandValidator();
    }

    [Fact]
    public void Validate_WithValidCommand_ShouldNotHaveErrors()
    {
        // Arrange
        var command = new CreateCardCommand
        {
            UserId = Guid.NewGuid(),
            HolderName = "Juan Pérez",
            CreditLimit = 150000
        };

        // Act
        var result = _validator.TestValidate(command);

        // Assert
        result.ShouldNotHaveAnyValidationErrors();
    }

    [Theory]
    [InlineData("")]
    [InlineData(" ")]
    [InlineData(null)]
    public void Validate_WithInvalidHolderName_ShouldHaveError(string? holderName)
    {
        // Arrange
        var command = new CreateCardCommand
        {
            UserId = Guid.NewGuid(),
            HolderName = holderName!,
            CreditLimit = 150000
        };

        // Act
        var result = _validator.TestValidate(command);

        // Assert
        result.ShouldHaveValidationErrorFor(x => x.HolderName)
            .WithErrorMessage("El nombre del titular es requerido");
    }

    [Fact]
    public void Validate_WithCreditLimitExceedingMaximum_ShouldHaveError()
    {
        // Arrange
        var command = new CreateCardCommand
        {
            UserId = Guid.NewGuid(),
            HolderName = "Juan Pérez",
            CreditLimit = 350000 
        };

        // Act
        var result = _validator.TestValidate(command);

        // Assert
        result.ShouldHaveValidationErrorFor(x => x.CreditLimit)
            .WithErrorMessage("El cupo de crédito no puede exceder $300,000 COP");
    }
}
