namespace Card.Domain.ValueObjects;

using Shared.Domain;
using Shared.Exceptions;
using System.Text.RegularExpressions;

/// <summary>
/// Value Object representing a credit card number
/// Encapsulates validation and formatting rules
/// </summary>
public sealed class CardNumber : ValueObject
{
    private const int CardNumberLength = 16;
    private static readonly Regex CardNumberRegex = new Regex(@"^\d{16}$", RegexOptions.Compiled);

    public string Value { get; }

    private CardNumber(string value)
    {
        Value = value;
    }

    public static CardNumber Create(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
            throw new DomainException("Card number cannot be empty");

        // Remove spaces and dashes
        var cleanValue = value.Replace(" ", "").Replace("-", "");

        if (cleanValue.Length != CardNumberLength)
            throw new DomainException($"Card number must be {CardNumberLength} digits");

        if (!CardNumberRegex.IsMatch(cleanValue))
            throw new DomainException("Card number must contain only digits");

        if (!IsValidLuhn(cleanValue))
            throw new DomainException("Card number failed Luhn validation");

        return new CardNumber(cleanValue);
    }

    /// <summary>
    /// Returns masked card number showing only last 4 digits
    /// Example: ****-****-****-1234
    /// </summary>
    public string Masked()
    {
        return $"****-****-****-{Value.Substring(12)}";
    }

    /// <summary>
    /// Returns formatted card number with spaces
    /// Example: 1234 5678 9012 3456
    /// </summary>
    public string Formatted()
    {
        return $"{Value.Substring(0, 4)} {Value.Substring(4, 4)} {Value.Substring(8, 4)} {Value.Substring(12, 4)}";
    }

    /// <summary>
    /// Validates card number using Luhn algorithm (mod 10)
    /// </summary>
    private static bool IsValidLuhn(string cardNumber)
    {
        int sum = 0;
        bool alternate = false;

        for (int i = cardNumber.Length - 1; i >= 0; i--)
        {
            int digit = cardNumber[i] - '0';

            if (alternate)
            {
                digit *= 2;
                if (digit > 9)
                    digit -= 9;
            }

            sum += digit;
            alternate = !alternate;
        }

        return sum % 10 == 0;
    }

    protected override IEnumerable<object> GetEqualityComponents()
    {
        yield return Value;
    }

    public override string ToString() => Masked();

    // Implicit conversion for easier usage
    public static implicit operator string(CardNumber cardNumber) => cardNumber.Value;
}
