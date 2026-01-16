namespace User.Application.Services;

using Shared.Facades;
using User.Application.Commands;

public interface IAuthService
{
    Task<LoginResponse> LoginAsync(LoginCommand command);
    Task<UserDto> RegisterAsync(RegisterCommand command);
}