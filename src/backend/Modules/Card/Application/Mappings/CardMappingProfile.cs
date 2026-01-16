namespace Card.Application.Mappings;

using AutoMapper;
using Card.Domain.Entities;
using Card.Domain.ValueObjects;
using Shared.Domain.ValueObjects;
using Shared.Facades;

public class CardMappingProfile : Profile
{
    public CardMappingProfile()
    {
        CreateMap<Card, CardSummaryDto>()
            .ForMember(dest => dest.CardNumber, 
                opt => opt.MapFrom(src => src.CardNumber.Masked()))
            .ForMember(dest => dest.Balance, 
                opt => opt.MapFrom(src => src.Balance.Amount))
            .ForMember(dest => dest.Status, 
                opt => opt.MapFrom(src => src.Status.ToString()));

        CreateMap<CardNumber, string>()
            .ConvertUsing(src => src.Value);
        
        CreateMap<Money, decimal>()
            .ConvertUsing(src => src.Amount);
    }
}
