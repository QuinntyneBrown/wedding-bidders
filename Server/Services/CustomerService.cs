using System;
using System.Linq;
using WeddingBidders.Server.Data.Contracts;
using WeddingBidders.Server.Dtos;
using WeddingBidders.Server.Models;
using WeddingBidders.Server.Services.Contracts;

namespace WeddingBidders.Server.Services
{
    public class CustomerService : ICustomerService
    {
        public CustomerService(IWeddingBiddersUow uow, IEncryptionService encryptionService)
        {
            this.uow = uow;
            this.encryptionService = encryptionService;
        }

        public CustomerRegistrationResponseDto TryToRegister(CustomerRegistrationRequestDto dto)
        {            
            if(uow.Users.GetAll().Where(x=>x.Username == dto.Email).FirstOrDefault() != null)
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
                AccountType = AccountType.Customer,
                User = user
            };

            var profile = new Profile()
            {
                Name = string.Format("{0} {1}",dto.Firstname, dto.Lastname),
                Account = account
            };

            var customer = new Customer()
            {
                Firstname = dto.Firstname,
                Lastname = dto.Lastname,
                Email = dto.Email,
                Profile = profile
            };
            
            user.Accounts.Add(account);
            account.Profiles.Add(profile);

            uow.Users.Add(user);
            uow.Accounts.Add(account);
            uow.Customers.Add(customer);
            uow.SaveChanges();


            var response = new CustomerRegistrationResponseDto()
            {
                Firstname = customer.Firstname,
                Lastname = customer.Lastname,
                Id = customer.Id
            };

            return response;
        }

        public CustomerDto GetByEmail(string email)
        {
            var customer = uow.Customers.GetAll().Single(x => x.Email == email);

            return new CustomerDto()
            {
                Firstname = customer.Firstname,
                Lastname = customer.Lastname,
                Email = customer.Email
            };
        }

        protected readonly IWeddingBiddersUow uow;

        protected readonly IEncryptionService encryptionService;
    }
}