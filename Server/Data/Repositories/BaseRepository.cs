using Core.Shared.Interfaces.IRepository;
using Core.Shared.Wrappers;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace Data.Repositories
{
    public class BaseRepository<TEntity> : IBaseRepository<TEntity> where TEntity : class
    {
        public readonly AppDbContext _context;

        public BaseRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(TEntity entity)
        {
            await _context.Set<TEntity>().AddAsync(entity);
        }

        public async Task AddRangeAsync(IEnumerable<TEntity> entities)
        {
            await _context.Set<TEntity>().AddRangeAsync(entities);
        }

        public async Task<int> CountAsync(Expression<Func<TEntity, bool>>? predicate = null)
        {
            var query = _context.Set<TEntity>();
            if (predicate != null)
            {
                return await query.CountAsync(predicate);
            }
            return await query.CountAsync();   
        }

        public Task DeleteAsync(TEntity entity)
        {
            _context.Set<TEntity>().Remove(entity);
            return Task.CompletedTask;
        }

        public Task DeleteRangeAsync(IEnumerable<TEntity> entities)
        {
            _context.Set<TEntity>().RemoveRange(entities);
            return Task.CompletedTask;
        }

        public async Task<bool> ExistsAsync(Expression<Func<TEntity, bool>>? predicate = null)
        {
            if (predicate == null)
            {
                return await _context.Set<TEntity>().AnyAsync();
            }
            return await _context.Set<TEntity>().AnyAsync(predicate);
        }

        public async Task<TEntity?> FindAsync<TId>(TId id)
        {
            return await _context.Set<TEntity>().FindAsync(id);
        }

        public async Task<TEntity?> FindAsync(Expression<Func<TEntity, bool>> predicate)
        {
            return await _context.Set<TEntity>().FirstOrDefaultAsync(predicate);
        }

        public async Task<TProjection?> FindAsync<TProjection>(
            Expression<Func<TEntity, bool>> predicate, 
            Expression<Func<TEntity, TProjection>> projection)
        {
            return await _context.Set<TEntity>()
                .Where(predicate)
                .Select(projection)
                .FirstOrDefaultAsync();
        }

        public async Task<IEnumerable<TEntity>> GetAllAsync(
            Expression<Func<TEntity, object>>? sortBy = null,
            bool isAsc = true)
        {
            var query = _context.Set<TEntity>().AsQueryable().AsNoTracking();
            if (sortBy != null)
            {
                if (isAsc) query = query.OrderBy(sortBy);
                else query = query.OrderByDescending(sortBy);
            }
            return await query.ToListAsync();
        }

        public async Task<IEnumerable<TEntity>> GetAllAsync(
            Expression<Func<TEntity, bool>> predicate,
            Expression<Func<TEntity, object>>? include = null,
            Expression<Func<TEntity, object>>? sortBy = null,
            bool isAsc = true)
        {
            var query = _context.Set<TEntity>().AsQueryable().AsNoTracking();
            if (sortBy != null)
            {
                if (isAsc) query = query.OrderBy(sortBy);
                else query = query.OrderByDescending(sortBy);
            }
            if (include != null)
            {
                query = query.Include(include);
            }    
            return await query
                .Where(predicate)
                .ToListAsync();
        }

        public async Task<IEnumerable<TProjection>> GetAllAsync<TProjection>(
            Expression<Func<TEntity, bool>>? predicate, 
            Expression<Func<TEntity, TProjection>> projection, 
            Expression<Func<TEntity, object>>? sortBy = null,
            bool isAsc = true)
        {
            var query = _context.Set<TEntity>().AsNoTracking();
            if (predicate != null)
            {
                query = query.Where(predicate);
            }
            if (sortBy != null)
            {
                if (isAsc) query = query.OrderBy(sortBy);
                else query = query.OrderByDescending(sortBy);
            }
            return await query
                .Select(projection)
                .ToArrayAsync();
        }

        public async Task<Paginated<TEntity>> GetPaginatedAsync(
            Expression<Func<TEntity, bool>>? predicate, int page, int size,
            Expression<Func<TEntity, object>>? sortBy = null,
            bool isAsc = true)
        {
            var query = _context.Set<TEntity>().AsNoTracking();
            
            if (predicate != null)
            {
                query = query.Where(predicate);
            }

            if (sortBy != null)
            {
                if (isAsc) query = query.OrderBy(sortBy);
                else query = query.OrderByDescending(sortBy);
            }

            return new Paginated<TEntity>
            {
                Page = page,
                Size = size,
                TotalItems = await query.CountAsync(),
                Items = await query
                    .Skip((page - 1) * size)
                    .Take(size)
                    .ToArrayAsync(),
            };
        }

        public async Task<Paginated<TProjection>> GetPaginatedAsync<TProjection>(
            Expression<Func<TEntity, bool>>? predicate, 
            int page, 
            int size, 
            Expression<Func<TEntity, TProjection>> projection, 
            Expression<Func<TEntity, object>>? sortBy = null,
            bool isAsc = true)
        {
            var query = _context.Set<TEntity>().AsNoTracking();

            if (predicate != null)
            {
                query = query.Where(predicate);
            }

            if (sortBy != null)
            {
                if (isAsc) query = query.OrderBy(sortBy);
                else query = query.OrderByDescending(sortBy);
            }

            return new Paginated<TProjection>
            {
                Page = page,
                Size = size,
                TotalItems = await query.CountAsync(),
                Items = await query
                    .Skip((page - 1) * size)
                    .Take(size)
                    .Select(projection)
                    .ToArrayAsync(),
            };
        }

        public async Task SaveToDatabaseAsync()
        {
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(TEntity entity, Action<TEntity> updateAction)
        {
            var entry = _context.Entry(entity);
            if (entry.State == EntityState.Detached)
            {
                _context.Attach(entity);
            }
            var originalValues = entry.CurrentValues.Clone();
            updateAction(entity);

            // Compare and mark need change prop
            foreach (var property in entry.Properties)
            {
                var originalValue = originalValues[property.Metadata.Name];
                if (!Equals(originalValue, property.CurrentValue))
                {
                    property.IsModified = true;
                }
            }

            await Task.CompletedTask;
        }
        
        public async Task UpdateAsync(TEntity entity)
        {
            _context.Set<TEntity>().Update(entity);
        }
    }
}
