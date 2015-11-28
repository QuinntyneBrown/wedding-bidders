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
            
            var user = new User()
            {
                Username = dto.Email,
                Firstname = dto.Firstname,
                Lastname = dto.Lastname,
                Password = encryptionService.TransformPassword(dto.Password),
            };

            user.Roles.Add(uow.Roles.GetAll().Single(x => x.Name == "Customer"));

            uow.Users.Add(user);
            uow.SaveChanges();

            var customer = new Customer()
            {
                Firstname = dto.Firstname,
                Lastname = dto.Lastname,
                User = user,
                UserId = user.Id
            };
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

        protected readonly IWeddingBiddersUow uow;

        protected readonly IEncryptionService encryptionService;
    }
}