using System;
using WeddingBidders.Server.Data.Contracts;
using WeddingBidders.Server.Dtos;
using WeddingBidders.Server.Models;
using WeddingBidders.Server.Services.Contracts;

namespace WeddingBidders.Server.Services
{
    public class CatererService : ICatererService
    {
        public CatererService(IEncryptionService encryptionService, IWeddingBiddersUow uow)
        {
            this.encryptionService = encryptionService;
            this.uow = uow;
        }

        public CatererRegistrationResponseDto TryToRegister(CatererRegistrationRequestDto dto)
        {

            var user = new User()
            {
                Username = dto.Email,
                Firstname = dto.Firstname,
                Lastname = dto.Lastname,
                Password = encryptionService.TransformPassword(dto.Password),
            };

            uow.Users.Add(user);
            uow.SaveChanges();

            var caterer = new Caterer()
            {
                Firstname = dto.Firstname,
                Lastname = dto.Lastname,
                User = user,
                UserId = user.Id
            };
            uow.Caterers.Add(caterer);
            uow.SaveChanges();


            var response = new CatererRegistrationResponseDto()
            {
                Firstname = caterer.Firstname,
                Lastname = caterer.Lastname,
                Id = caterer.Id
            };

            return response;
        }

        protected readonly IWeddingBiddersUow uow;

        protected readonly IEncryptionService encryptionService;
    }
}