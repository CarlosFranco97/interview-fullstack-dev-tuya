namespace Card.Domain.Tests.ValueObjects;

using Shared.Domain.ValueObjects;
using FluentAssertions;
using Shared.Exceptions;
using Xunit;

public class MoneyTests
{
    [Fact]
    public void Create_WithValidAmount_ShouldSucceed()
    {
        // Arrange & Act
        var money = Money.Create(100.50m, "COP");

        // Assert
        money.Amount.Should().Be(100.50m);
        money.Currency.Should().Be("COP");
    }

    [Fact]
    public void Create_WithNegativeAmount_ShouldThrowException()
    {
        // Act
        var action = () => Money.Create(-100, "COP");

        // Assert
        action.Should().Throw<DomainException>()
            .WithMessage("Amount cannot be negative");
    }

    [Fact]
    public void Add_WithSameCurrency_ShouldSucceed()
    {
        // Arrange
        var money1 = Money.Create(100, "COP");
        var money2 = Money.Create(50, "COP");

        // Act
        var result = money1.Add(money2);

        // Assert
        result.Amount.Should().Be(150);
        result.Currency.Should().Be("COP");
    }

    [Fact]
    public void Subtract_WithDifferentCurrency_ShouldThrowException()
    {
        // Arrange
        var money1 = Money.Create(100, "COP");
        var money2 = Money.Create(30, "USD");

        // Act
        var action = () => money1.Subtract(money2);

        // Assert
        action.Should().Throw<DomainException>()
            .WithMessage("Cannot subtract USD from COP");
    }
}
