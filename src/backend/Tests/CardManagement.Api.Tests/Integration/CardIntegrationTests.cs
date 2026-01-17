namespace CardManagement.Api.Tests.Integration;

using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using FluentAssertions;
using Xunit;

public class CardIntegrationTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly HttpClient _client;

    public CardIntegrationTests(CustomWebApplicationFactory factory)
    {
        _client = factory.CreateClient();
    }

    private async Task<string> RegisterAndGetToken()
    {
        var registerRequest = new
        {
            username = $"user_{Guid.NewGuid():N}",
            email = $"user_{Guid.NewGuid():N}@example.com",
            password = "Password123!",
            fullName = "Test User"
        };

        var registerResponse = await _client.PostAsJsonAsync("/api/auth/register", registerRequest);
        registerResponse.EnsureSuccessStatusCode();
        
        var loginRequest = new
        {
            username = registerRequest.username,
            password = registerRequest.password
        };
        
        var loginResponse = await _client.PostAsJsonAsync("/api/auth/login", loginRequest);
        var content = await loginResponse.Content.ReadAsStringAsync();
        var result = JsonDocument.Parse(content);
        return result.RootElement.GetProperty("token").GetString()!;
    }

    [Fact]
    public async Task CreateCard_WithValidData_ShouldReturn200()
    {
        // Arrange
        var token = await RegisterAndGetToken();
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        var createCardRequest = new
        {
            holderName = "Juan Pérez",
            creditLimit = 150000
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/cards", createCardRequest);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Created);
        
        var content = await response.Content.ReadAsStringAsync();
        var result = JsonDocument.Parse(content);
        result.RootElement.TryGetProperty("id", out var cardId).Should().BeTrue();
        cardId.GetGuid().Should().NotBeEmpty();
    }

    [Fact]
    public async Task CreateCard_WithoutAuthentication_ShouldReturn401()
    {
        // Arrange
        var createCardRequest = new
        {
            holderName = "Juan Pérez",
            creditLimit = 150000
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/cards", createCardRequest);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task CreateCard_ExceedingLimit_ShouldReturn400()
    {
        // Arrange
        var token = await RegisterAndGetToken();
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        var createCardRequest = new
        {
            holderName = "Juan Pérez",
            creditLimit = 400000 
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/cards", createCardRequest);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task CreateCard_MoreThan3ActiveCards_ShouldReturn400()
    {
        // Arrange
        var token = await RegisterAndGetToken();
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        var createCardRequest = new
        {
            holderName = "Test User",
            creditLimit = 100000
        };

        for (int i = 0; i < 3; i++)
        {
            var response = await _client.PostAsJsonAsync("/api/cards", createCardRequest);
            response.EnsureSuccessStatusCode();
        }

        // Act
        var failResponse = await _client.PostAsJsonAsync("/api/cards", createCardRequest);

        // Assert
        failResponse.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }
}
