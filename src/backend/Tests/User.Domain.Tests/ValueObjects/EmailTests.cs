namespace User.Domain.Tests.ValueObjects;

using User.Domain.ValueObjects;
using FluentAssertions;
using Shared.Exceptions;
using Xunit;

public class EmailTests
{
    [Fact]
    public void Create_WithValidEmail_ShouldSucceed()
    {
        // Arrange
        var email = "user@example.com";

        // Act
        var result = Email.Create(email);

        // Assert
        result.Should().NotBeNull();
        result.Value.Should().Be(email.ToLower());
    }

    [Theory]
    [InlineData("notanemail")]
    [InlineData("@example.com")]
    [InlineData("user@")]
    [InlineData("user.example.com")]
    public void Create_WithInvalidFormat_ShouldThrowException(string email)
    {
        // Act
        var action = () => Email.Create(email);

        // Assert
        action.Should().Throw<DomainException>()
            .WithMessage("Formato de correo electrónico inválido");
    }

    [Fact]
    public void GetDomain_ShouldReturnDomainPart()
    {
        // Arrange
        var email = Email.Create("user@example.com");

        // Act
        var domain = email.GetDomain();

        // Assert
        domain.Should().Be("example.com");
    }
}
