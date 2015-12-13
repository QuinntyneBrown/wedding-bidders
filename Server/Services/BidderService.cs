using System;
using System.Data.Entity;
using System.Linq;
using WeddingBidders.Server.Data.Contracts;
using WeddingBidders.Server.Dtos;
using WeddingBidders.Server.Models;
using WeddingBidders.Server.Services.Contracts;

namespace WeddingBidders.Server.Services
{
    public class BidderService : IBidderService
    {
        public BidderService(IWeddingBiddersUow uow, IEncryptionService encryptionService)
        {
            this.uow = uow;
            this.encryptionService = encryptionService;
        }

        public BidderDto GetByEmail(string email)
        {
            throw new NotImplementedException();
        }

        public BidderRegistrationResponseDto TryToRegister(BidderRegistrationRequestDto dto)
        {
            if (uow.Users.GetAll().Where(x => x.Username == dto.Email).FirstOrDefault() != null)
                throw new System.Exception("Invalid Email Address");

            var user = new User()
            {
                Username = dto.Email,
                Firstname = dto.Firstname,
                Lastname = dto.Lastname,
                Password = encryptionService.TransformPassword(dto.Password),
            };

            uow.Users.Add(user);

            var account = new Account()
            {
                Firstname = dto.Firstname,
                Lastname = dto.Lastname,
                Email = dto.Email,
                AccountType = AccountType.Bidder,
                User = user
            };

            user.Accounts.Add(account);

            Profile profile = Map(dto.Firstname, dto.Lastname,account,dto.BidderType);

            account.Profiles.Add(profile);

            Bidder bidder = null;

            if (dto.BidderType == BidderType.Caterer)
            {
                bidder = new Caterer()
                {
                    Firstname = dto.Firstname,
                    Lastname = dto.Lastname,
                    Profile = profile,
                    Email = dto.Email
                };

                uow.Caterers.Add(bidder as Caterer);
            }

            uow.SaveChanges();

            var response = new BidderRegistrationResponseDto()
            {
                Firstname = bidder.Firstname,
                Lastname = bidder.Lastname,
                Id = bidder.Id
            };

            return response;
        }

        public Profile Map(string firstname, string lastname, Account account, BidderType bidderType)
        {
            var profile = new Profile();

            if (bidderType == BidderType.Caterer)
            {
                profile = new Profile()
                {
                    Name = string.Format("{0} {1}", firstname, lastname),
                    Account = account,
                    ProfileType = ProfileType.Caterer
                };
            }
            return profile;
        }


        protected readonly IWeddingBiddersUow uow;
        protected readonly IEncryptionService encryptionService;
    }
}