using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WeddingBidders.Server.Models;

namespace WeddingBidders.Server.Dtos
{
    public class CustomerDto
    {
        public CustomerDto()
        {

        }

        public CustomerDto(Customer customer)
        {
            this.Id = customer.Id;
            this.Firstname = customer.Firstname;
            this.Lastname = customer.Lastname;
            this.Email = customer.Email;                
        }

        public int? Id { get; set; }

        public string Firstname { get; set; }

        public string Lastname { get; set; }

        public string Email { get; set; }

        public ProfileType ProfileType { get { return ProfileType.Customer; } }
    }
}