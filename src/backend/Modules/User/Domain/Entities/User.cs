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
            throw new DomainException("El nombre de usuario es requerido");
        if (email == null)
            throw new DomainException("El correo electrónico es requerido");
        if (string.IsNullOrWhiteSpace(passwordHash))
            throw new DomainException("El hash de contraseña es requerido");
        if (string.IsNullOrWhiteSpace(fullName))
            throw new DomainException("El nombre completo es requerido");

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
            throw new DomainException("El usuario ya está inactivo");
        IsActive = false;
    }

    public void Activate()
    {
        if (IsActive)
            throw new DomainException("El usuario ya está activo");
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
