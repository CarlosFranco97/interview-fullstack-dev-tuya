namespace User.Application.Services;

using AutoMapper;
using BCrypt.Net;
using FluentValidation;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using User.Application.Commands;
using User.Domain.Repositories;
using User.Domain.ValueObjects;
using Shared.Exceptions;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly IValidator<RegisterCommand> _registerValidator;
    private readonly IValidator<LoginCommand> _loginValidator;
    private readonly IConfiguration _configuration;
    private readonly IMapper _mapper;

    public AuthService(
        IUserRepository userRepository,
        IValidator<RegisterCommand> registerValidator,
        IValidator<LoginCommand> loginValidator,
        IConfiguration configuration,
        IMapper mapper)
    {
        _userRepository = userRepository;
        _registerValidator = registerValidator;
        _loginValidator = loginValidator;
        _configuration = configuration;
        _mapper = mapper;
    }

    public async Task<Shared.Facades.UserDto> RegisterAsync(RegisterCommand command)
    {
        // Validar
        await _registerValidator.ValidateAndThrowAsync(command);

        // Verificar si usuario o email ya existen
        if (await _userRepository.UsernameExistsAsync(command.Username))
            throw new DomainException("Username already exists");

        if (await _userRepository.EmailExistsAsync(command.Email))
            throw new DomainException("Email already exists");

        // Hash password
        var passwordHash = BCrypt.HashPassword(command.Password);

        // Crear email como Value Object
        var email = Email.Create(command.Email);

        // Crear usuario
        var user = new Domain.Entities.User(
            command.Username,
            email,
            passwordHash,
            command.FullName
        );

        await _userRepository.AddAsync(user);

        return _mapper.Map<Shared.Facades.UserDto>(user);
    }

    public async Task<Shared.Facades.LoginResponse> LoginAsync(LoginCommand command)
    {
        // Validar
        await _loginValidator.ValidateAndThrowAsync(command);

        // Buscar usuario
        var user = await _userRepository.GetByUsernameAsync(command.Username);
        if (user == null)
            throw new UnauthorizedException("Invalid username or password");

        // Verificar password
        if (!BCrypt.Verify(command.Password, user.PasswordHash))
            throw new UnauthorizedException("Invalid username or password");

        // Verificar si está activo
        if (!user.IsActive)
            throw new UnauthorizedException("User account is inactive");

        // Generar token JWT
        var token = GenerateJwtToken(user);

        return new Shared.Facades.LoginResponse
        {
            Token = token,
            User = _mapper.Map<Shared.Facades.UserDto>(user)
        };
    }

    private string GenerateJwtToken(Domain.Entities.User user)
    {
        var key = _configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT Key not configured");
        var issuer = _configuration["Jwt:Issuer"] ?? "CardManagementApi";
        var audience = _configuration["Jwt:Audience"] ?? "CardManagementClient";

        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.UniqueName, user.Username),
            new Claim(JwtRegisteredClaimNames.Email, user.Email),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: DateTime.UtcNow.AddHours(8),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
