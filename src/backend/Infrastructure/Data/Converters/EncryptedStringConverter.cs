namespace Infrastructure.Data.Converters;

using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Infrastructure.Security;

/// <summary>
/// EF Core value converter that transparently encrypts/decrypts strings
/// Used for sensitive data like card numbers
/// </summary>
public class EncryptedStringConverter : ValueConverter<string, string>
{
    public EncryptedStringConverter(IEncryptionService encryptionService)
        : base(
            v => encryptionService.Encrypt(v),
            v => encryptionService.Decrypt(v))
    {
    }
}
