using Core.Modules.ListeningModule.DTOs.Session;
using Core.Modules.ListeningModule.Entities;
using Core.Modules.ListeningModule.Interfaces;
using Core.Shared.DTOs;
using Core.Shared.Exceptions;
using Core.Shared.Interfaces.IRepository;
using Core.Shared.Utilities;
using Core.Shared.Wrappers;
using System;
using System.Linq.Expressions;

namespace Core.Modules.ListeningModule.Services
{
    public class SessionService : ISessionService
    {
        private readonly IBaseRepository<Session> _sessionRepository;
        private readonly IBaseRepository<Topic> _topicRepository;
        private readonly IBaseRepository<Track> _trackRepository;

        public SessionService(
            IBaseRepository<Session> sessionRepository,
            IBaseRepository<Topic> topicRepository,
            IBaseRepository<Track> trackRepository)
        {
            _sessionRepository = sessionRepository;
            _topicRepository = topicRepository;
            _trackRepository = trackRepository;
        }

        public async Task<ApiResult<SessionDto>> CreateNewSession(int topicId, CreateSessionDto request)
        {
            // Check if topic exists
            var topicName = await _topicRepository.FindAsync(
                e => e.Id == topicId,
                e => e.Name)
                ?? throw new NotFoundException(
                    "Topic does not exists.",
                    ApiHelper.ErrorCodes.RESOURCE_NOT_FOUND);

            // Check if name exists
            if (await _sessionRepository.ExistsAsync(
                e => e.Name == request.Name &&
                e.TopicId == topicId))
            {
                throw new ConflictException(
                    "Session name already exists in the topic.",
                    ApiHelper.ErrorCodes.ALREADY_EXISTS);
            }

            // Create new
            var session = new Session()
            {
                Name = request.Name,
                TopicId = topicId,
                CreatedAt = DateTime.UtcNow,
                OrderInTopic = await _sessionRepository.CountAsync(
                    e => e.TopicId == topicId) + 1,
                UpdatedAt = DateTime.UtcNow,
            };
            await _sessionRepository.AddAsync(session);
            await _sessionRepository.SaveToDatabaseAsync();

            return new()
            {
                Data = new()
                {
                    Id = session.Id,
                    Name = session.Name,
                    TopicId = session.TopicId,
                    CreatedAt = session.CreatedAt,
                    UpdatedAt = session.UpdatedAt,
                    TrackCount = 0,
                    OrderInTopic = session.OrderInTopic,
                    TopicName = topicName
                }
            };
        }

        public async Task<ApiResult<DeleteResponseDto>> DeleteSession(int id)
        {
            // Session must exists to remove
            var session = await _sessionRepository.FindAsync(e => e.Id == id)
                ?? throw new NotFoundException(
                    "Session does not exist.",
                    ApiHelper.ErrorCodes.RESOURCE_NOT_FOUND);
            await _sessionRepository.DeleteAsync(session);
            await _sessionRepository.SaveToDatabaseAsync();

            // Update all session order (In topic)
            var remainingSessions = (await _sessionRepository
                .GetAllAsync(
                    e => e.TopicId == session.TopicId,
                    sortBy: e => e.OrderInTopic)).ToArray();
            for (int i = 0; i < remainingSessions.Length; i++)
            {
                await _sessionRepository.UpdateAsync(
                    remainingSessions[i],
                    e => e.OrderInTopic = i + 1);
            }
            await _sessionRepository.SaveToDatabaseAsync();

            return new ApiResult<DeleteResponseDto>
            {
                Message = "Delete session successfully.",
                Data = new ()
                {
                    Id = session.Id,
                }
            };
        }

        public async Task<ApiResult<Paginated<SessionListItemDto>>> GetAllSessions(SearchSessionRequestDto request)
        {
            var predicateBuiler = new PredicateBuilder<Session>();

            // Build expression
            if (int.TryParse(request.Key, out var id))
            {
                predicateBuiler.OrCondition(e => e.Id == id);
            }
            if (!string.IsNullOrEmpty(request.Key))
            {
                predicateBuiler.OrCondition(e => e.Name.Contains(request.Key));
            }
            if (request.TopicId != null)
            {
                predicateBuiler.AndCondition(e => e.TopicId == request.TopicId);
            }

            //Console.WriteLine($"Predicate: {predicateBuiler.GetPredicate().ToString()}");

            // Get Data
            var result = await _sessionRepository.GetPaginatedAsync(
                    predicate: predicateBuiler.GetPredicateOrDefault(),
                    request.Page,
                    request.Size,
                    sortBy: null,
                    isAsc: true,
                    projection: e => new SessionListItemDto
                    {
                        Id = e.Id,
                        Name = e.Name,
                        OrderInTopic = e.OrderInTopic,
                        TopicId = e.TopicId,
                    });
            foreach (var item in result.Items)
            {
                item.TrackCount = await _trackRepository.CountAsync(e => e.SessionId == item.Id);
            }

            return new ApiResult<Paginated<SessionListItemDto>>
            {
                Message = null,
                Data = result
            };
        }

        public async Task<ApiResult<SessionDto>> GetSession(int id)
        {
            return new()
            {
                Data = await _sessionRepository
                    .FindAsync(e => e.Id == id, e => new SessionDto
                    {
                        Id = e.Id,
                        Name = e.Name,
                        TopicId = e.TopicId,
                        CreatedAt = e.CreatedAt,
                        UpdatedAt = e.UpdatedAt,
                        OrderInTopic = e.OrderInTopic,
                        TopicName = e.Topic.Name,
                        TrackCount = e.Tracks.Count
                    })
                    ?? throw new NotFoundException(
                    "Session does not exists.",
                    ApiHelper.ErrorCodes.RESOURCE_NOT_FOUND)
            };
        }

        public async Task<ApiResult<SessionListItemDto[]>> GetSessionsOfTopic(int topicId)
        {
            if (!await _topicRepository.ExistsAsync(e => e.Id == topicId))
            {
                throw new NotFoundException(
                    "Topic does not exists.",
                    ApiHelper.ErrorCodes.RESOURCE_NOT_FOUND);
            }

            return new()
            {
                Message = null,
                Data = (await _sessionRepository
                    .GetAllAsync(
                    e => e.TopicId == topicId, 
                    e => new SessionListItemDto
                    {
                        Id = e.Id,
                        Name = e.Name,
                        OrderInTopic = e.OrderInTopic,
                        TrackCount = e.Tracks.Count,
                        TopicId = e.TopicId,
                    },
                    sortBy: e => e.OrderInTopic)).ToArray()
            };
        }

        public async Task<ApiResult<UpdateResponseDto>> UpdateSession(int id, UpdateSessionDto request)
        {
            // Session must exists to update
            var session = await _sessionRepository.FindAsync(
                e => e.Id == id)
                ?? throw new NotFoundException(
                    "Session does not exist.",
                    ApiHelper.ErrorCodes.RESOURCE_NOT_FOUND);
            await _sessionRepository.UpdateAsync(session, e => e.Name = request.Name);
            await _sessionRepository.SaveToDatabaseAsync();

            return new ApiResult<UpdateResponseDto>()
            {
                Message = "Update session successfully.",
                Data = new ()
                {
                    Id = session.Id,
                    UpdatedAt = session.UpdatedAt
                }
            };
        }

        public async Task<ApiResult<UpdateTrackOrderDto>> UpdateTrackOrder(int sessionId, UpdateTrackOrderDto request)
        {
            // Session must exists to update
            if (!await _sessionRepository.ExistsAsync(e => e.Id == sessionId)) {
                throw new NotFoundException(
                    "Session does not exist.",
                    ApiHelper.ErrorCodes.RESOURCE_NOT_FOUND);
            }

            // Update track order
            var tracks = (await _trackRepository
                .GetAllAsync(e => e.SessionId == sessionId))
                .ToDictionary(e => e.Id);
            foreach ( var item in request.TrackOrder )
            {
                if (tracks.TryGetValue(item.TrackId, out var track))
                {
                    await _trackRepository.UpdateAsync(track, e => e.OrderInSession = item.Order);
                }
                else
                {
                    throw new NotFoundException(
                    "The list has track which does not exist.",
                    ApiHelper.ErrorCodes.RESOURCE_NOT_FOUND);
                }
            }
            await _trackRepository.SaveToDatabaseAsync();

            return new()
            {
                Message = "Update track order successfully.",
                Data = null
            };
        }
    }
}
