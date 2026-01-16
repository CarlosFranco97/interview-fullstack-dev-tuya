namespace Payment.Application.Mappings;

using AutoMapper;
using Payment.Domain.Entities;
using Payment.Application.DTOs;

public class PaymentMappingProfile : Profile
{
    public PaymentMappingProfile()
    {
        CreateMap<PaymentEntity, PaymentDto>()
            .ForMember(dest => dest.Status, 
                opt => opt.MapFrom(src => src.Status.ToString()));
    }
}
