namespace CardManagement.Api.Controllers;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Payment.Application.Commands;
using FluentValidation;
using System.Security.Claims;
using Payment.Application.Services.Interfaces;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class PaymentsController : ControllerBase
{
    private readonly IPaymentService _paymentService;
    private readonly IValidator<ProcessPaymentCommand> _validator;

    public PaymentsController(
        IPaymentService paymentService,
        IValidator<ProcessPaymentCommand> validator)
    {
        _paymentService = paymentService;
        _validator = validator;
    }

    [HttpPost]
    public async Task<IActionResult> ProcessPayment([FromBody] ProcessPaymentCommand command)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userIdClaim == null || !Guid.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized();
        }

        var commandWithUserId = command with { UserId = userId };

        var validationResult = await _validator.ValidateAsync(commandWithUserId);
        if (!validationResult.IsValid)
        {
            return BadRequest(new { errors = validationResult.Errors.Select(e => e.ErrorMessage) });
        }

        var result = await _paymentService.ProcessPaymentAsync(commandWithUserId);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetPayment(Guid id)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userIdClaim == null || !Guid.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized();
        }

        var payment = await _paymentService.GetPaymentByIdAsync(id);
        if (payment == null)
        {
            return NotFound();
        }

        if (payment.UserId != userId)
        {
            return Forbid();
        }

        return Ok(payment);
    }

    [HttpGet]
    public async Task<IActionResult> GetUserPayments()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userIdClaim == null || !Guid.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized();
        }

        var payments = await _paymentService.GetPaymentsByUserIdAsync(userId);
        return Ok(payments);
    }
}
