namespace User.Application.Commands;

public record RegisterCommand
{
    public string Username { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string Password { get; set; } = null!;
    public string FullName { get; set; } = null!;
}

public record LoginCommand
{
    public string Username { get; set; } = null!;
    public string Password { get; set; } = null!;
}
