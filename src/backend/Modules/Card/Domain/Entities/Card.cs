namespace Card.Domain.Entities;

using global::Card.Domain.ValueObjects;
using global::Shared.Domain.ValueObjects;
using global::Shared.Exceptions;

public class Card
{
    public Guid Id { get; private set; }
    public Guid UserId { get; private set; }

    private string _cardNumber = null!;
    public CardNumber CardNumber 
    { 
        get => CardNumber.Create(_cardNumber);
        private set => _cardNumber = value.Value;
    }

    public string HolderName { get; private set; } = null!;
    public DateTime ExpirationDate { get; private set; }

    private decimal _balance;
    public Money Balance 
    { 
        get => Money.Create(_balance, "COP");
        private set => _balance = value.Amount;
    }

    private decimal _creditLimit;
    public Money CreditLimit 
    { 
        get => Money.Create(_creditLimit, "COP");
        private set => _creditLimit = value.Amount;
    }

    public CardStatus Status { get; private set; }
    public DateTime CreatedAt { get; private set; }

    private Card() { }

    public Card(Guid userId, CardNumber cardNumber, string holderName, DateTime expirationDate, Money creditLimit)
    {
        if (cardNumber == null) throw new DomainException("Card number is required");
        if (string.IsNullOrWhiteSpace(holderName)) throw new DomainException("Holder name is required");
        if (creditLimit == null) throw new DomainException("Credit limit is required");

        Id = Guid.NewGuid();
        UserId = userId;
        _cardNumber = cardNumber.Value;
        HolderName = holderName;
        ExpirationDate = expirationDate;
        _creditLimit = creditLimit.Amount;
        _balance = creditLimit.Amount;
        Status = CardStatus.Inactive;
        CreatedAt = DateTime.UtcNow;
    }

    public void Activate()
    {
        if (IsExpired())
            throw new InvalidOperationException("Cannot activate an expired card");
        if (Status == CardStatus.Active)
            throw new InvalidOperationException("Card is already active");

        Status = CardStatus.Active;
    }

    public void Block()
    {
        if (Status == CardStatus.Blocked)
            throw new InvalidOperationException("Card is already blocked");

        Status = CardStatus.Blocked;
    }

    public void Debit(Money amount)
    {
        if (!CanProcessTransaction())
            throw new InvalidOperationException("Card cannot process transactions");
        
        if (!HasSufficientBalance(amount))
            throw new InvalidOperationException("Insufficient balance");

        _balance = Balance.Subtract(amount).Amount;
    }

    public void Credit(Money amount)
    {
        var newBalance = Balance.Add(amount);
        
        if (newBalance.IsGreaterThan(CreditLimit))
            _balance = _creditLimit;
        else
            _balance = newBalance.Amount;
    }

    public bool HasSufficientBalance(Money amount)
    {
        return Balance.IsGreaterThanOrEqual(amount);
    }

    public Money GetAvailableCredit() => Balance;

    public Money GetUsedCredit() => CreditLimit.Subtract(Balance);

    public void UpdateHolderName(string newName)
    {
        if (string.IsNullOrWhiteSpace(newName))
            throw new DomainException("Holder name cannot be empty");
        HolderName = newName;
    }

    public void UpdateExpirationDate(DateTime newDate)
    {
        if (newDate < DateTime.UtcNow)
            throw new DomainException("Expiration date cannot be in the past");
        ExpirationDate = newDate;
    }

    public void UpdateCreditLimit(Money newLimit)
    {
        if (newLimit.Amount <= 0)
            throw new DomainException("El límite de crédito debe ser positivo");
        if (newLimit.Amount > 300000)
            throw new DomainException("El límite de crédito no puede exceder $300,000 COP");
        
        var usedCredit = GetUsedCredit();
        _creditLimit = newLimit.Amount;
        _balance = newLimit.Amount - usedCredit.Amount;
    }

    public bool IsExpired() => DateTime.UtcNow > ExpirationDate;

    public bool CanProcessTransaction() => Status == CardStatus.Active && !IsExpired();

    public string GetMaskedCardNumber() => CardNumber.Masked();
}