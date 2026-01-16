namespace CardManagement.Api.Controllers;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Card.Application.Commands;
using Shared.Facades;
using FluentValidation;
using System.Security.Claims;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class CardsController : ControllerBase
{
    private readonly ICardFacade _cardFacade;
    private readonly IValidator<CreateCardCommand> _createCardValidator;

    public CardsController(
        ICardFacade cardFacade,
        IValidator<CreateCardCommand> createCardValidator)
    {
        _cardFacade = cardFacade;
        _createCardValidator = createCardValidator;
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetCard(Guid id)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userIdClaim == null || !Guid.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized();
        }

        var card = await _cardFacade.GetCardSummaryAsync(id);
        if (card == null)
        {
            return NotFound();
        }

        // Verify the card belongs to the user
        var belongsToUser = await _cardFacade.CardBelongsToUserAsync(id, userId);
        if (!belongsToUser)
        {
            return Forbid();
        }

        return Ok(card);
    }
}
