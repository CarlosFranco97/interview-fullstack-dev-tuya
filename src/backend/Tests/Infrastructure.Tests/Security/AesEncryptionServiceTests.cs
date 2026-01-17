namespace Infrastructure.Tests.Security;

using Infrastructure.Security;
using FluentAssertions;
using Xunit;

public class AesEncryptionServiceTests
{
    private readonly AesEncryptionService _encryptionService;

    public AesEncryptionServiceTests()
    {
        var key = "12345678901234567890123456789012"; 
        _encryptionService = new AesEncryptionService(key);
    }

    [Fact]
    public void Encrypt_ShouldReturnDifferentValue()
    {
        // Arrange
        var plaintext = "4532015112830366";

        // Act
        var encrypted = _encryptionService.Encrypt(plaintext);

        // Assert
        encrypted.Should().NotBe(plaintext);
        encrypted.Should().NotBeNullOrEmpty();
    }

    [Fact]
    public void Decrypt_ShouldReturnOriginalValue()
    {
        // Arrange
        var plaintext = "4532015112830366";
        var encrypted = _encryptionService.Encrypt(plaintext);

        // Act
        var decrypted = _encryptionService.Decrypt(encrypted);

        // Assert
        decrypted.Should().Be(plaintext);
    }

    [Fact]
    public void EncryptDecrypt_WithMultipleValues_ShouldWork()
    {
        // Arrange
        var values = new[]
        {
            "4532015112830366",
            "5425233430109903",
            "4916338506082832"
        };

        // Act & Assert
        foreach (var value in values)
        {
            var encrypted = _encryptionService.Encrypt(value);
            var decrypted = _encryptionService.Decrypt(encrypted);
            decrypted.Should().Be(value);
        }
    }
}
