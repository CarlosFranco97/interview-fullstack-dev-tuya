namespace User.Application.Facades;

using AutoMapper;
using Shared.Facades;
using User.Domain.Repositories;

public class UserFacade : IUserFacade
{
    private readonly IUserRepository _userRepository;
    private readonly IMapper _mapper;

    public UserFacade(IUserRepository userRepository, IMapper mapper)
    {
        _userRepository = userRepository;
        _mapper = mapper;
    }

    public async Task<UserDto?> GetUserByIdAsync(Guid userId)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        return user == null ? null : _mapper.Map<UserDto>(user);
    }

    public async Task<bool> UserExistsAsync(Guid userId)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        return user != null && user.IsActive;
    }
}
