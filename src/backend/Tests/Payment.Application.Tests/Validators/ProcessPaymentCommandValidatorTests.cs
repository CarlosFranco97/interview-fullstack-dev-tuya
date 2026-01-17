namespace Payment.Application.Tests.Validators;

using Payment.Application.Commands;
using Payment.Application.Validators;
using FluentAssertions;
using FluentValidation.TestHelper;
using Xunit;

public class ProcessPaymentCommandValidatorTests
{
    private readonly ProcessPaymentCommandValidator _validator;

    public ProcessPaymentCommandValidatorTests()
    {
        _validator = new ProcessPaymentCommandValidator();
    }

    [Fact]
    public void Validate_WithValidCommand_ShouldNotHaveErrors()
    {
        // Arrange
        var command = new ProcessPaymentCommand
        {
            CardId = Guid.NewGuid(),
            Amount = 50000,
            Description = "Compra en tienda"
        };

        // Act
        var result = _validator.TestValidate(command);

        // Assert
        result.ShouldNotHaveAnyValidationErrors();
    }

    [Theory]
    [InlineData(0)]
    [InlineData(-1)]
    [InlineData(-100)]
    public void Validate_WithInvalidAmount_ShouldHaveError(decimal amount)
    {
        // Arrange
        var command = new ProcessPaymentCommand
        {
            CardId = Guid.NewGuid(),
            Amount = amount,
            Description = "Compra"
        };

        // Act
        var result = _validator.TestValidate(command);

        // Assert
        result.ShouldHaveValidationErrorFor(x => x.Amount)
            .WithErrorMessage("El monto debe ser positivo");
    }

    [Fact]
    public void Validate_WithEmptyDescription_ShouldStillBeValid()
    {
        // Arrange
        var command = new ProcessPaymentCommand
        {
            CardId = Guid.NewGuid(),
            Amount = 50000,
            Description = ""
        };

        // Act
        var result = _validator.TestValidate(command);

        // Assert
        result.ShouldNotHaveAnyValidationErrors();
    }
}
