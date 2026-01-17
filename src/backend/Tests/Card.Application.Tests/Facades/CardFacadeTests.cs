namespace Card.Application.Tests.Facades;

using Card.Application.Facades;
using Card.Domain.Entities;
using Card.Domain.Repositories;
using Card.Domain.ValueObjects;
using Shared.Domain.ValueObjects;
using FluentAssertions;
using Moq;
using AutoMapper;
using Card.Application.Mappings;
using Xunit;

public class CardFacadeTests
{
    private readonly Mock<ICardRepository> _cardRepositoryMock;
    private readonly IMapper _mapper;
    private readonly CardFacade _cardFacade;

    public CardFacadeTests()
    {
        _cardRepositoryMock = new Mock<ICardRepository>();
        
        var config = new MapperConfiguration(cfg =>
        {
            cfg.AddProfile<CardMappingProfile>();
        });
        _mapper = config.CreateMapper();

        _cardFacade = new CardFacade(_cardRepositoryMock.Object, _mapper);
    }

    private static Card CreateCard(
        Guid? userId = null,
        string cardNumber = "4532015112830366",
        string holderName = "Juan Pérez",
        decimal creditLimit = 100000,
        CardStatus status = CardStatus.Inactive)
    {
        var card = new Card(
            userId ?? Guid.NewGuid(),
            CardNumber.Create(cardNumber),
            holderName,
            DateTime.UtcNow.AddYears(5),
            Money.Create(creditLimit, "COP")
        );

        if (status == CardStatus.Active)
            card.Activate();
        else if (status == CardStatus.Blocked)
        {
            card.Activate();
            card.Block();
        }

        return card;
    }

    [Fact]
    public async Task CreateCardAsync_With3ActiveCards_ShouldThrowException()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var holderName = "Juan Pérez";
        var creditLimit = 150000m;

        var existingCards = new List<Card>
        {
            CreateCard(userId, "4532015112830366", "Card 1", 100000, CardStatus.Active),
            CreateCard(userId, "5425233430109903", "Card 2", 100000, CardStatus.Active),
            CreateCard(userId, "4916338506082832", "Card 3", 100000, CardStatus.Active)
        };

        _cardRepositoryMock
            .Setup(x => x.GetCardsByUserIdAsync(userId))
            .ReturnsAsync(existingCards);

        // Act
        var action = async () => await _cardFacade.CreateCardAsync(userId, holderName, creditLimit);

        // Assert
        await action.Should().ThrowAsync<InvalidOperationException>()
            .WithMessage("El usuario ha alcanzado el límite máximo de 3 tarjetas de crédito activas");

        _cardRepositoryMock.Verify(x => x.AddAsync(It.IsAny<Card>()), Times.Never);
    }

    [Fact]
    public async Task CreateCardAsync_ShouldGenerateCardWithBIN4532()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var holderName = "Juan Pérez";
        var creditLimit = 150000m;
        Card? capturedCard = null;

        _cardRepositoryMock
            .Setup(x => x.GetCardsByUserIdAsync(userId))
            .ReturnsAsync(new List<Card>());

        _cardRepositoryMock
            .Setup(x => x.ExistsAsync(It.IsAny<string>()))
            .ReturnsAsync(false);

        _cardRepositoryMock
            .Setup(x => x.AddAsync(It.IsAny<Card>()))
            .Callback<Card>(card => capturedCard = card)
            .Returns(Task.CompletedTask);

        // Act
        await _cardFacade.CreateCardAsync(userId, holderName, creditLimit);

        // Assert
        capturedCard.Should().NotBeNull();
        capturedCard!.CardNumber.Value.Should().StartWith("4532");
        capturedCard.CardNumber.Value.Should().HaveLength(16);
    }

    [Fact]
    public async Task CreateCardAsync_ShouldSetExpirationDateTo5Years()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var holderName = "Juan Pérez";
        var creditLimit = 150000m;
        Card? capturedCard = null;

        _cardRepositoryMock
            .Setup(x => x.GetCardsByUserIdAsync(userId))
            .ReturnsAsync(new List<Card>());

        _cardRepositoryMock
            .Setup(x => x.ExistsAsync(It.IsAny<string>()))
            .ReturnsAsync(false);

        _cardRepositoryMock
            .Setup(x => x.AddAsync(It.IsAny<Card>()))
            .Callback<Card>(card => capturedCard = card)
            .Returns(Task.CompletedTask);

        // Act
        await _cardFacade.CreateCardAsync(userId, holderName, creditLimit);

        // Assert
        capturedCard.Should().NotBeNull();
        var expectedExpiration = DateTime.UtcNow.AddYears(5);
        capturedCard!.ExpirationDate.Year.Should().Be(expectedExpiration.Year);
        capturedCard.ExpirationDate.Month.Should().Be(expectedExpiration.Month);
        capturedCard.ExpirationDate.Day.Should().Be(DateTime.DaysInMonth(expectedExpiration.Year, expectedExpiration.Month));
    }

    [Fact]
    public async Task UpdateCardAsync_ShouldUpdateHolderNameAndCreditLimit()
    {
        // Arrange
        var cardId = Guid.NewGuid();
        var userId = Guid.NewGuid();
        var existingCard = CreateCard(userId, "4532015112830366", "Old Name", 100000);
        existingCard.Activate();
        existingCard.Debit(Money.Create(30000, "COP"));

        var newHolderName = "New Name";
        var newCreditLimit = 200000m;

        _cardRepositoryMock
            .Setup(x => x.GetByIdAsync(cardId))
            .ReturnsAsync(existingCard);

        _cardRepositoryMock
            .Setup(x => x.UpdateAsync(It.IsAny<Card>()))
            .Returns(Task.CompletedTask);

        // Act
        await _cardFacade.UpdateCardAsync(cardId, newHolderName, newCreditLimit);

        // Assert
        existingCard.HolderName.Should().Be(newHolderName);
        existingCard.CreditLimit.Amount.Should().Be(newCreditLimit);
        existingCard.Balance.Amount.Should().Be(170000); 
        _cardRepositoryMock.Verify(x => x.UpdateAsync(existingCard), Times.Once);
    }
}
