namespace Shared.Facades;

public class UserDto
{
    public Guid Id { get; set; }
    public string Username { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string FullName { get; set; } = null!;
}

public class LoginResponse
{
    public string Token { get; set; } = null!;
    public UserDto User { get; set; } = null!;
}

public interface IUserFacade
{
    Task<UserDto?> GetUserByIdAsync(Guid userId);
    Task<bool> UserExistsAsync(Guid userId);
}
