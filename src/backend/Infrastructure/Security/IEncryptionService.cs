namespace Infrastructure.Security;

/// <summary>
/// Interface for encryption/decryption services
/// </summary>
public interface IEncryptionService
{
    /// <summary>
    /// Encrypts a plain text string
    /// </summary>
    string Encrypt(string plainText);

    /// <summary>
    /// Decrypts an encrypted string
    /// </summary>
    string Decrypt(string encryptedText);
}
