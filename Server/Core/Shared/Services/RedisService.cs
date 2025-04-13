using Core.Shared.Interfaces.IService;
using StackExchange.Redis;

namespace Core.Shared.Services
{
    public class RedisService : IRedisService
    {
        private readonly IConnectionMultiplexer _redis;

        public RedisService(IConnectionMultiplexer redis)
        {
            _redis = redis;
        }

        public async Task<bool> Delete(string type, string key)
        {
            return await _redis.GetDatabase().KeyDeleteAsync($"{type}:{key}");
        }

        public async Task<string?> Get(string type, string key)
        {
            return await _redis.GetDatabase().StringGetAsync($"{type}:{key}");
        }

        public async Task<long> GetTTL(string type, string key)
        {
            TimeSpan? ttl = await _redis.GetDatabase().KeyTimeToLiveAsync($"{type}:{key}");
            if (ttl is null) return -1;
            return (long)ttl.Value.TotalSeconds;
        }

        public async Task<bool> IsExists(string type, string key)
        {
            return await _redis.GetDatabase().KeyExistsAsync($"{type}:{key}");
        }

        public async Task<bool> Set(string type, string key, string value, TimeSpan ttl)
        {
            return await _redis.GetDatabase().StringSetAsync($"{type}:{key}", value, ttl);
        }

        public async Task<bool> UpdateAndKeepTTL(string type, string key, string value)
        {
            var db = _redis.GetDatabase();
            var ttl = await db.KeyTimeToLiveAsync($"{type}:{key}");
            if (ttl.HasValue)
            {
                return await db.StringSetAsync($"{type}:{key}", value, ttl);
            }
            return await db.StringSetAsync($"{type}:{key}", value);
        }
    }
}
