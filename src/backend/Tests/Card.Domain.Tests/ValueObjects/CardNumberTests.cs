namespace Card.Domain.Tests.ValueObjects;

using Card.Domain.ValueObjects;
using FluentAssertions;
using Shared.Exceptions;
using Xunit;

public class CardNumberTests
{
    [Fact]
    public void Create_WithValidCardNumber_ShouldSucceed()
    {
        // Arrange
        var validCardNumber = "4532015112830366"; 

        // Act
        var cardNumber = CardNumber.Create(validCardNumber);

        // Assert
        cardNumber.Should().NotBeNull();
        cardNumber.Value.Should().Be(validCardNumber);
    }

    [Fact]
    public void Create_WithInvalidLuhn_ShouldThrowException()
    {
        // Arrange
        var invalidCardNumber = "4532015112830367"; 

        // Act
        var action = () => CardNumber.Create(invalidCardNumber);

        // Assert
        action.Should().Throw<DomainException>()
            .WithMessage("Card number failed Luhn validation");
    }

    [Fact]
    public void Masked_ShouldReturnLastFourDigits()
    {
        // Arrange
        var cardNumber = CardNumber.Create("4532015112830366");

        // Act
        var masked = cardNumber.Masked();

        // Assert
        masked.Should().Be("****-****-****-0366");
    }

    [Fact]
    public void Formatted_ShouldReturnFormattedCardNumber()
    {
        // Arrange
        var cardNumber = CardNumber.Create("4532015112830366");

        // Act
        var formatted = cardNumber.Formatted();

        // Assert
        formatted.Should().Be("4532 0151 1283 0366");
    }
}
