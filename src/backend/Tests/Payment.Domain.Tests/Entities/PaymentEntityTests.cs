namespace Payment.Domain.Tests.Entities;

using Payment.Domain.Entities;
using Payment.Domain.Enums;
using FluentAssertions;
using Shared.Exceptions;
using Xunit;

public class PaymentEntityTests
{
    [Fact]
    public void Constructor_WithValidData_ShouldCreatePayment()
    {
        // Arrange
        var cardId = Guid.NewGuid();
        var userId = Guid.NewGuid();
        var amount = 50000m;
        var description = "Compra en tienda";

        // Act
        var payment = new PaymentEntity(cardId, userId, amount, description);

        // Assert
        payment.Id.Should().NotBeEmpty();
        payment.CardId.Should().Be(cardId);
        payment.UserId.Should().Be(userId);
        payment.Amount.Should().Be(amount);
        payment.Description.Should().Be(description);
        payment.Status.Should().Be(PaymentStatus.Pending);
    }

    [Fact]
    public void Complete_WithPendingPayment_ShouldMarkAsCompleted()
    {
        // Arrange
        var payment = new PaymentEntity(Guid.NewGuid(), Guid.NewGuid(), 50000m, "Test");

        // Act
        payment.MarkAsCompleted();

        // Assert
        payment.Status.Should().Be(PaymentStatus.Completed);
    }

    [Fact]
    public void Fail_WithPendingPayment_ShouldMarkAsFailed()
    {
        // Arrange
        var payment = new PaymentEntity(Guid.NewGuid(), Guid.NewGuid(), 50000m, "Test");

        // Act
        payment.MarkAsFailed();

        // Assert
        payment.Status.Should().Be(PaymentStatus.Failed);
    }
}
