﻿using System;
using System.Linq;
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
            if (uow.Users.GetAll().Where(x => x.Username == dto.Email).FirstOrDefault() != null)
                throw new System.Exception("Invalid Email Address");

            var user = new User()
            {
                Username = dto.Email,
                Firstname = dto.Firstname,
                Lastname = dto.Lastname,
                Password = encryptionService.TransformPassword(dto.Password),
            };

            var account = new Account()
            {
                Firstname = dto.Firstname,
                Lastname = dto.Lastname,
                Email = dto.Email,
                AccountType = AccountType.Bidder,
                User = user
            };

            var profile = new Profile()
            {
                Name = string.Format("{0} {1}", dto.Firstname, dto.Lastname),
                Account = account,
                ProfileType = ProfileType.Caterer
            };

            var caterer = new Caterer()
            {
                Firstname = dto.Firstname,
                Lastname = dto.Lastname,
                Profile = profile,
                Email = dto.Email
            };

            user.Accounts.Add(account);
            account.Profiles.Add(profile);

            uow.Users.Add(user);
            uow.Accounts.Add(account);
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

        public CatererDto GetByEmail(string email)
        {
            var caterer = uow.Caterers.GetAll().Single(x => x.Email == email);

            return new CatererDto()
            {
                Firstname = caterer.Firstname,
                Lastname = caterer.Lastname,
                Email = caterer.Email
            };
        }

        protected readonly IWeddingBiddersUow uow;

        protected readonly IEncryptionService encryptionService;
    }
}