using Core.Shared.Wrappers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Core.Shared.Interfaces
{
    public interface IRepository<TEntity> where TEntity : class
    {
        /// <summary>
        /// Checks if any entity satisfies the given predicate condition.
        /// </summary>
        Task<bool> ExistsAsync(Expression<Func<TEntity, bool>>? predicate);

        /// <summary>
        /// Retrieves all entities in the collection.
        /// </summary>
        Task<IEnumerable<TEntity>> GetAllAsync();

        /// <summary>
        /// Retrieves all entities that satisfy the given predicate condition.
        /// </summary>
        Task<IEnumerable<TEntity>> GetAllAsync(Expression<Func<TEntity, bool>> predicate);

        /// <summary>
        /// Retrieves all entities that satisfy the predicate, projected into a specified type.
        /// </summary>
        Task<IEnumerable<TProjection>> GetAllAsync<TProjection>(
            Expression<Func<TEntity, bool>> predicate,
            Expression<Func<TEntity, TProjection>> projection);

        /// <summary>
        /// Retrieves a paginated list of entities based on the predicate, page number, and page size.
        /// </summary>
        Task<Paginated<TEntity>> GetPaginatedAsync(
            Expression<Func<TEntity, bool>>? predicate,
            int page,
            int size);

        /// <summary>
        /// Retrieves a paginated list of entities based on the predicate, projected into a specified type.
        /// </summary>
        Task<Paginated<TProjection>> GetPaginatedAsync<TProjection>(
            Expression<Func<TEntity, bool>>? predicate,
            int page,
            int size,
            Expression<Func<TEntity, TProjection>> projection);

        /// <summary>
        /// Finds the first entity that satisfies the given predicate.
        /// </summary>
        Task<TEntity?> FindAsync(Expression<Func<TEntity, bool>> predicate);

        /// <summary>
        /// Finds the first entity that satisfies the predicate and projects it into a specified type.
        /// </summary>
        Task<TProjection?> FindAsync<TProjection>(
            Expression<Func<TEntity, bool>> predicate,
            Expression<Func<TEntity, TProjection>> projection);

        /// <summary>
        /// Adds a single entity to the collection.
        /// </summary>
        Task AddAsync(TEntity entity);

        /// <summary>
        /// Adds multiple entities to the collection.
        /// </summary>
        Task AddRangeAsync(IEnumerable<TEntity> entities);

        /// <summary>
        /// Updates a single entity in the collection.
        /// </summary>
        Task UpdateAsync(TEntity entity);

        /// <summary>
        /// Updates multiple entities in the collection.
        /// </summary>
        Task UpdateRangeAsync(IEnumerable<TEntity> entities);

        /// <summary>
        /// Deletes a single entity from the collection.
        /// </summary>
        Task DeleteAsync(TEntity entity);

        /// <summary>
        /// Deletes multiple entities from the collection.
        /// </summary>
        Task DeleteRangeAsync(IEnumerable<TEntity> entities);

        /// <summary>
        /// Saves all changes made to the database.
        /// </summary>
        Task SaveToDatabaseAsync();
    }
}
