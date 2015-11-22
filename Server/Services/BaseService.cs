using System;
using Common.Caching.Contracts;
namespace WeddingBidders.Server.Services
{
    public class BaseService
    {
        private readonly ICache cache;
        public BaseService(ICacheProvider cacheProvider)
        {
            this.cache = cacheProvider.GetCache();
        }

        protected TResp FromCacheOrService<TResp>(Func<TResp> action, string key)
        {
            var cached = cache.Get(key);

            if (cached == null)
            {
                cached = action();
                cache.Add(cached, key);
            }

            return (TResp)cached;
        }
    }
}
