namespace User.Domain.Tests.Entities;

using User.Domain.Entities;
using User.Domain.ValueObjects;
using FluentAssertions;
using Shared.Exceptions;
using Xunit;

public class UserTests
{
    [Fact]
    public void Constructor_WithValidData_ShouldCreateUser()
    {
        // Arrange
        var username = "testuser";
        var email = Email.Create("test@example.com");
        var passwordHash = "hashedpassword123";
        var fullName = "Test User";

        // Act
        var user = new User(username, email, passwordHash, fullName);

        // Assert
        user.Id.Should().NotBeEmpty();
        user.Username.Should().Be("testuser");
        user.Email.Value.Should().Be("test@example.com");
        user.PasswordHash.Should().Be(passwordHash);
        user.FullName.Should().Be(fullName);
        user.IsActive.Should().BeTrue();
    }

    [Fact]
    public void Activate_WithInactiveUser_ShouldActivate()
    {
        // Arrange
        var user = new User("testuser", Email.Create("test@example.com"), "hash", "Test");
        user.Deactivate();

        // Act
        user.Activate();

        // Assert
        user.IsActive.Should().BeTrue();
    }

    [Fact]
    public void Deactivate_WithActiveUser_ShouldDeactivate()
    {
        // Arrange
        var user = new User("testuser", Email.Create("test@example.com"), "hash", "Test");

        // Act
        user.Deactivate();

        // Assert
        user.IsActive.Should().BeFalse();
    }
}
