namespace Infrastructure.Tests.Repositories;

using Card.Domain.Entities;
using Card.Domain.ValueObjects;
using Infrastructure.Data;
using Infrastructure.Repositories;
using Infrastructure.Security;
using Shared.Domain.ValueObjects;
using FluentAssertions;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Xunit;

public class CardRepositoryTests : IDisposable
{
    private readonly SqliteConnection _connection;
    private readonly AppDbContext _context;
    private readonly CardRepository _repository;

    public CardRepositoryTests()
    {
        // Create SQLite InMemory database
        _connection = new SqliteConnection("DataSource=:memory:");
        _connection.Open();

        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseSqlite(_connection)
            .Options;

        var encryptionService = new AesEncryptionService("12345678901234567890123456789012");
        _context = new AppDbContext(options, encryptionService);
        _context.Database.EnsureCreated();

        _repository = new CardRepository(_context);
    }

    public void Dispose()
    {
        _context.Dispose();
        _connection.Close();
        _connection.Dispose();
    }

    private static Card CreateCard(
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
    public async Task AddAsync_ShouldPersistCard()
    {
        // Arrange
        var card = CreateCard();

        // Act
        await _repository.AddAsync(card);
        await _context.SaveChangesAsync();

        // Assert
        var savedCard = await _context.Cards.FindAsync(card.Id);
        savedCard.Should().NotBeNull();
        savedCard!.Id.Should().Be(card.Id);
    }

    [Fact]
    public async Task GetByIdAsync_ShouldReturnCard()
    {
        // Arrange
        var card = CreateCard();
        await _context.Cards.AddAsync(card);
        await _context.SaveChangesAsync();

        // Act
        var result = await _repository.GetByIdAsync(card.Id);

        // Assert
        result.Should().NotBeNull();
        result!.Id.Should().Be(card.Id);
        result.HolderName.Should().Be("Juan Pérez");
    }

    [Fact]
    public async Task GetCardsByUserIdAsync_ShouldReturnUserCards()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var card1 = CreateCard(userId, "4532015112830366", "Card 1");
        var card2 = CreateCard(userId, "5425233430109903", "Card 2");
        var otherUserCard = CreateCard(Guid.NewGuid(), "4916338506082832", "Other Card");

        await _context.Cards.AddRangeAsync(card1, card2, otherUserCard);
        await _context.SaveChangesAsync();

        // Act
        var result = await _repository.GetCardsByUserIdAsync(userId);

        // Assert
        var cards = result.ToList();
        cards.Should().HaveCount(2);
        cards.Should().AllSatisfy(c => c.UserId.Should().Be(userId));
    }

    [Fact]
    public async Task CardNumber_ShouldBeEncryptedInDatabase()
    {
        // Arrange
        var cardNumber = "4532015112830366";
        var card = CreateCard(cardNumber: cardNumber);
        await _context.Cards.AddAsync(card);
        await _context.SaveChangesAsync();

        // Act
        var retrievedCard = await _repository.GetByIdAsync(card.Id);

        // Assert
        retrievedCard.Should().NotBeNull();
        retrievedCard!.CardNumber.Value.Should().Be(cardNumber);
    }
}
