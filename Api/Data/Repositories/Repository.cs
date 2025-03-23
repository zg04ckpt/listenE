using Core.Shared.Interfaces;
using Core.Shared.Wrappers;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Data.Repositories
{
    public class Repository<TEntity> : IRepository<TEntity> where TEntity : class
    {
        public readonly AppDbContext _context;

        public Repository(AppDbContext context)
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

        public async Task<bool> ExistsAsync(Expression<Func<TEntity, bool>>? predicate)
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
                .Select(projection)
                .FirstOrDefaultAsync();
        }

        public async Task<IEnumerable<TEntity>> GetAllAsync()
        {
            return await _context.Set<TEntity>().AsNoTracking().ToListAsync();
        }

        public async Task<IEnumerable<TEntity>> GetAllAsync(Expression<Func<TEntity, bool>> predicate)
        {
            return await _context.Set<TEntity>().AsNoTracking()
                .Where(predicate)
                .ToListAsync();
        }

        public async Task<IEnumerable<TProjection>> GetAllAsync<TProjection>(
            Expression<Func<TEntity, bool>> predicate, 
            Expression<Func<TEntity, TProjection>> projection)
        {
            return await _context.Set<TEntity>().AsNoTracking()
                .Where(predicate)
                .Select(projection)
                .ToListAsync();
        }

        public async Task<Paginated<TEntity>> GetPaginatedAsync(Expression<Func<TEntity, bool>>? predicate, int page, int size)
        {
            var query = _context.Set<TEntity>().AsNoTracking();
            
            if (predicate != null)
            {
                query = query.Where(predicate);
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
            Expression<Func<TEntity, TProjection>> projection)
        {
            var query = _context.Set<TEntity>().AsNoTracking();

            if (predicate != null)
            {
                query = query.Where(predicate);
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

        public Task UpdateAsync(TEntity entity)
        {
            _context.Set<TEntity>().Update(entity);
            return Task.CompletedTask;
        }

        public Task UpdateRangeAsync(IEnumerable<TEntity> entities)
        {
            _context.Set<TEntity>().UpdateRange(entities);
            return Task.CompletedTask;
        }
    }
}
