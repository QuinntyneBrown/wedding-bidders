using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Web;

namespace WeddingBidders.Server.Services.Contracts
{
    public interface IProfileService
    {
        dynamic GetCurrentProfile(HttpRequestMessage request);
    }
}