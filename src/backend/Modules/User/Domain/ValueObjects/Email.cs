namespace User.Domain.ValueObjects;

using Shared.Domain;
using Shared.Exceptions;
using System.Text.RegularExpressions;

/// <summary>
/// Value Object representing an email address
/// Encapsulates validation and normalization rules
/// </summary>
public sealed class Email : ValueObject
{
    private static readonly Regex EmailRegex = new Regex(
        @"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$",
        RegexOptions.Compiled | RegexOptions.IgnoreCase);

    public string Value { get; }

    private Email(string value)
    {
        Value = value;
    }

    public static Email Create(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
            throw new DomainException("Email cannot be empty");

        var normalizedEmail = value.Trim().ToLower();

        if (normalizedEmail.Length > 100)
            throw new DomainException("Email cannot exceed 100 characters");

        if (!EmailRegex.IsMatch(normalizedEmail))
            throw new DomainException("Invalid email format");

        return new Email(normalizedEmail);
    }

    /// <summary>
    /// Returns the domain part of the email
    /// Example: user@example.com returns example.com
    /// </summary>
    public string GetDomain()
    {
        var atIndex = Value.IndexOf('@');
        return atIndex >= 0 ? Value.Substring(atIndex + 1) : string.Empty;
    }

    /// <summary>
    /// Returns the local part of the email
    /// Example: user@example.com returns user
    /// </summary>
    public string GetLocalPart()
    {
        var atIndex = Value.IndexOf('@');
        return atIndex >= 0 ? Value.Substring(0, atIndex) : Value;
    }

    /// <summary>
    /// Masks the email for display purposes
    /// Example: user@example.com returns u***@example.com
    /// </summary>
    public string Masked()
    {
        var atIndex = Value.IndexOf('@');
        if (atIndex <= 1)
            return Value;

        var localPart = Value.Substring(0, atIndex);
        var domain = Value.Substring(atIndex);

        return $"{localPart[0]}***{domain}";
    }

    protected override IEnumerable<object> GetEqualityComponents()
    {
        yield return Value;
    }

    public override string ToString() => Value;

    // Implicit conversion for easier usage
    public static implicit operator string(Email email) => email.Value;
}
