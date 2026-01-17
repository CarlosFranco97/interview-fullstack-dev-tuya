namespace Card.Domain.Tests.Entities;

using Card.Domain.Entities;
using Card.Domain.ValueObjects;
using Shared.Domain.ValueObjects;
using FluentAssertions;
using Shared.Exceptions;
using Xunit;

public class CardTests
{
    private static Card CreateValidCard(
        Guid? userId = null,
        string cardNumber = "4532015112830366",
        string holderName = "Juan Pérez",
        decimal creditLimit = 100000)
    {
        return new Card(
            userId ?? Guid.NewGuid(),
            CardNumber.Create(cardNumber),
            holderName,
            DateTime.UtcNow.AddYears(5),
            Money.Create(creditLimit, "COP")
        );
    }

    [Fact]
    public void Constructor_WithValidData_ShouldCreateCard()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var cardNumber = CardNumber.Create("4532015112830366");
        var holderName = "Juan Pérez";
        var expirationDate = DateTime.UtcNow.AddYears(5);
        var creditLimit = Money.Create(100000, "COP");

        // Act
        var card = new Card(userId, cardNumber, holderName, expirationDate, creditLimit);

        // Assert
        card.Id.Should().NotBeEmpty();
        card.UserId.Should().Be(userId);
        card.CardNumber.Value.Should().Be("4532015112830366");
        card.HolderName.Should().Be(holderName);
        card.ExpirationDate.Should().Be(expirationDate);
        card.CreditLimit.Amount.Should().Be(100000);
        card.Balance.Amount.Should().Be(100000);
        card.Status.Should().Be(CardStatus.Inactive);
    }

    [Fact]
    public void Activate_WithInactiveCard_ShouldActivateCard()
    {
        // Arrange
        var card = CreateValidCard();

        // Act
        card.Activate();

        // Assert
        card.Status.Should().Be(CardStatus.Active);
    }

    [Fact]
    public void Debit_WithSufficientBalance_ShouldDecreaseBalance()
    {
        // Arrange
        var card = CreateValidCard(creditLimit: 100000);
        card.Activate();
        var debitAmount = Money.Create(30000, "COP");

        // Act
        card.Debit(debitAmount);

        // Assert
        card.Balance.Amount.Should().Be(70000);
    }

    [Fact]
    public void UpdateCreditLimit_WithValidLimit_ShouldUpdateAndAdjustBalance()
    {
        // Arrange
        var card = CreateValidCard(creditLimit: 100000);
        card.Activate();
        card.Debit(Money.Create(40000, "COP"));
        var newLimit = Money.Create(200000, "COP");

        // Act
        card.UpdateCreditLimit(newLimit);

        // Assert
        card.CreditLimit.Amount.Should().Be(200000);
        card.Balance.Amount.Should().Be(160000);
        card.GetUsedCredit().Amount.Should().Be(40000); 
    }
}
