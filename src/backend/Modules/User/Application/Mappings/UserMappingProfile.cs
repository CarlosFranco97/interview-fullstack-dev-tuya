namespace User.Application.Mappings;

using AutoMapper;
using User.Domain.Entities;
using User.Application.DTOs;

public class UserMappingProfile : Profile
{
    public UserMappingProfile()
    {
        CreateMap<Domain.Entities.User, UserDto>();
        
        CreateMap<Domain.Entities.User, Shared.Facades.UserDto>();
    }
}
