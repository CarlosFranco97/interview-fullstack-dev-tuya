namespace Shared.Domain.ValueObjects;

using Shared.Exceptions;

/// <summary>
/// Value Object representing a monetary amount
/// Prevents invalid operations and ensures currency consistency
/// </summary>
public sealed class Money : ValueObject
{
    public decimal Amount { get; }
    public string Currency { get; }

    private Money(decimal amount, string currency)
    {
        Amount = amount;
        Currency = currency;
    }

    public static Money Create(decimal amount, string currency = "USD")
    {
        if (amount < 0)
            throw new DomainException("Amount cannot be negative");

        if (string.IsNullOrWhiteSpace(currency))
            throw new DomainException("Currency cannot be empty");

        if (currency.Length != 3)
            throw new DomainException("Currency must be a 3-letter ISO code");

        return new Money(amount, currency.ToUpper());
    }

    public static Money Zero(string currency = "USD") => new Money(0, currency);

    public Money Add(Money other)
    {
        if (Currency != other.Currency)
            throw new DomainException($"Cannot add {other.Currency} to {Currency}");

        return new Money(Amount + other.Amount, Currency);
    }

    public Money Subtract(Money other)
    {
        if (Currency != other.Currency)
            throw new DomainException($"Cannot subtract {other.Currency} from {Currency}");

        var result = Amount - other.Amount;
        if (result < 0)
            throw new DomainException("Resulting amount cannot be negative");

        return new Money(result, Currency);
    }

    public Money Multiply(decimal multiplier)
    {
        if (multiplier < 0)
            throw new DomainException("Multiplier cannot be negative");

        return new Money(Amount * multiplier, Currency);
    }

    public bool IsGreaterThan(Money other)
    {
        if (Currency != other.Currency)
            throw new DomainException($"Cannot compare {other.Currency} with {Currency}");

        return Amount > other.Amount;
    }

    public bool IsGreaterThanOrEqual(Money other)
    {
        if (Currency != other.Currency)
            throw new DomainException($"Cannot compare {other.Currency} with {Currency}");

        return Amount >= other.Amount;
    }

    public bool IsLessThan(Money other)
    {
        if (Currency != other.Currency)
            throw new DomainException($"Cannot compare {other.Currency} with {Currency}");

        return Amount < other.Amount;
    }

    public bool IsZero() => Amount == 0;

    protected override IEnumerable<object> GetEqualityComponents()
    {
        yield return Amount;
        yield return Currency;
    }

    public override string ToString() => $"{Amount.ToString("N2", System.Globalization.CultureInfo.InvariantCulture)} {Currency}";

    public static implicit operator decimal(Money money) => money.Amount;
}
