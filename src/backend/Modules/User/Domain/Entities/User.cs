namespace User.Domain.Entities;

using global::Shared.Exceptions;
using global::User.Domain.ValueObjects;

public class User
{
    public Guid Id { get; private set; }
    public string Username { get; private set; } = null!;
    
    private string _email = null!;
    public Email Email 
    { 
        get => Email.Create(_email);
        private set => _email = value.Value;
    }
    
    public string PasswordHash { get; private set; } = null!;
    public string FullName { get; private set; } = null!;
    public DateTime CreatedAt { get; private set; }
    public bool IsActive { get; private set; }

    private User() { }

    public User(string username, Email email, string passwordHash, string fullName)
    {
        if (string.IsNullOrWhiteSpace(username))
            throw new DomainException("Username is required");
        if (email == null)
            throw new DomainException("Email is required");
        if (string.IsNullOrWhiteSpace(passwordHash))
            throw new DomainException("Password hash is required");
        if (string.IsNullOrWhiteSpace(fullName))
            throw new DomainException("Full name is required");

        Id = Guid.NewGuid();
        Username = username.ToLower();
        _email = email.Value;
        PasswordHash = passwordHash;
        FullName = fullName;
        CreatedAt = DateTime.UtcNow;
        IsActive = true;
    }

    public void Deactivate()
    {
        if (!IsActive)
            throw new DomainException("User is already inactive");
        IsActive = false;
    }

    public void Activate()
    {
        if (IsActive)
            throw new DomainException("User is already active");
        IsActive = true;
    }

    public void UpdateProfile(string fullName, string email)
    {
        if (!string.IsNullOrWhiteSpace(fullName))
            FullName = fullName;
        if (!string.IsNullOrWhiteSpace(email))
            _email = Email.Create(email).Value;
    }
}
