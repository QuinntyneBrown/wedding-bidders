using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WeddingBidders.Server.Config.Contracts
{
    public interface IConfigurationProvider
    {
        T Get<T>() where T : class;
    }
}
