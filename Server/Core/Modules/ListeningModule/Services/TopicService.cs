using Core.Modules.ListeningModule.DTOs.Session;
using Core.Modules.ListeningModule.DTOs.Topic;
using Core.Modules.ListeningModule.Entities;
using Core.Modules.ListeningModule.Interfaces;
using Core.Shared.DTOs;
using Core.Shared.Exceptions;
using Core.Shared.Interfaces.IRepository;
using Core.Shared.Interfaces.IService;
using Core.Shared.Utilities;
using Core.Shared.Wrappers;

namespace Core.Modules.ListeningModule.Services
{
    public class TopicService : ITopicService
    {
        private readonly IBaseRepository<Topic> _topicRepository;
        private readonly IBaseRepository<Session> _sessionRepository;
        private readonly IStorageService _storageService;

        public TopicService(
            IBaseRepository<Topic> topicRepository, 
            IStorageService storageService, 
            IBaseRepository<Session> sessionRepository)
        {
            _topicRepository = topicRepository;
            _storageService = storageService;
            _sessionRepository = sessionRepository;
        }

        public async Task<ApiResult<TopicDto>> CreateNewTopic(CreateOrUpdateTopicDto request)
        {
            // Check if name exists
            if (await _topicRepository.ExistsAsync(e => e.Name == request.Name))
            {
                throw new ConflictException(
                    "Topic name already exists",
                    ApiHelper.ErrorCodes.ALREADY_EXISTS);
            }

            // New topic must has thumbnail
            if (request.Thumbnail == null)
            {
                throw new BadRequestException(
                    "A thumbnail is required for creating a new topic");
            }

            // Create new topic
            var topic = new Topic
            {
                Name = request.Name,
                Description = request.Description,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                ThumbnailUrl = await _storageService.SaveImage(request.Thumbnail)
                    ?? throw new ServerErrorException("Failed to upload image to cloudinary."),
                Level = request.Level
            };
            await _topicRepository.AddAsync(topic);
            await _topicRepository.SaveToDatabaseAsync();

            return new ApiResult<TopicDto>
            {
                Message = "Create topic successfully.",
                Data = new()
                {
                    Id = topic.Id,
                    Name = topic.Name,
                    Description = topic.Description,
                    CreatedAt = topic.CreatedAt,
                    ThumbnailUrl = topic.ThumbnailUrl,
                    SessionCount = 0,
                    UpdatedAt = topic.UpdatedAt,
                }
            };
        }

        public async Task<ApiResult<DeleteResponseDto>> DeleteTopic(int id)
        {
            var topic = await _topicRepository.FindAsync(e => e.Id == id)
                ?? throw new NotFoundException(
                    "Topic does not exist.",
                    ApiHelper.ErrorCodes.RESOURCE_NOT_FOUND);

            // Remove thumbnail in cloudy
            if (!await _storageService.RemoveImage(topic.ThumbnailUrl))
            {
                throw new ServerErrorException("Failed to delete image from cloudinary");
            }

            await _topicRepository.DeleteAsync(topic);
            await _topicRepository.SaveToDatabaseAsync();

            return new ApiResult<DeleteResponseDto>
            {
                Message = "Remove topic successfully.",
                Data = new ()
                {
                    Id = topic.Id,
                }
            };
        }

        public async Task<ApiResult<TopicDto>> GetTopic(int id)
        {
            var topic = await _topicRepository.FindAsync(
                e => e.Id == id,
                e => new TopicDto
                {
                    Id = e.Id,
                    Name = e.Name,
                    Description = e.Description,
                    CreatedAt = e.CreatedAt,
                    UpdatedAt = e.UpdatedAt,
                    SessionCount = e.Sessions.Count,
                    ThumbnailUrl = e.ThumbnailUrl,
                    Level = e.Level,
                })
                ?? throw new NotFoundException(
                    "Topic does not exist.",
                    ApiHelper.ErrorCodes.RESOURCE_NOT_FOUND);
            topic.SessionCount = await _sessionRepository.CountAsync(e => e.TopicId == id);
            return new()
            {
                Data = topic,
                Message = null
            };
        }

        public async Task<ApiResult<TopicListItemDto[]>> GetTopics()
        {
            return new ApiResult<TopicListItemDto[]>
            {
                Message = null,
                Data = (await _topicRepository.GetAllAsync(null, e => new TopicListItemDto
                {
                    Id = e.Id,
                    Name = e.Name,
                    ThumbnailUrl = e.ThumbnailUrl,
                    SessionCount = e.Sessions.Count,
                    Description = e.Description,
                    Level = e.Level
                })).ToArray()
            };
        }

        public async Task<ApiResult<UpdateResponseDto>> UpdateTopic(int id, CreateOrUpdateTopicDto request)
        {
            var topic = await _topicRepository.FindAsync(e => e.Id == id)
                ?? throw new NotFoundException(
                    "Topic does not exist.",
                    ApiHelper.ErrorCodes.RESOURCE_NOT_FOUND);

            // Update thumbnail by remove old image and save new one
            string? newThumbnail = null;
            if (request.Thumbnail != null)
            {
                if (!await _storageService.RemoveImage(topic.ThumbnailUrl))
                {
                    throw new ServerErrorException("Failed to delete image from cloudinary");
                }
                newThumbnail = await _storageService.SaveImage(request.Thumbnail)
                    ?? throw new ServerErrorException("Failed to upload image to cloudinary.");
            }
            await _topicRepository.UpdateAsync(topic, t =>
            {
                t.Description = request.Description;
                t.Level = request.Level;
                t.Name = request.Name;
                t.UpdatedAt = DateTime.UtcNow;
                t.ThumbnailUrl = newThumbnail ?? t.ThumbnailUrl;
            });
            await _topicRepository.SaveToDatabaseAsync();

            return new ApiResult<UpdateResponseDto>
            {
                Message = "Update topic successfully.",
                Data = new()
                {
                    Id = topic.Id,
                    UpdatedAt = topic.UpdatedAt,
                }
            };
        }

        public async Task<ApiResult<UpdateSessionOrderDto>> UpdateTopicSessionOrder(int sessionId, UpdateSessionOrderDto request)
        {
            // Check session valid
            if (!await _topicRepository.ExistsAsync(e => e.Id == sessionId))
            {
                throw new NotFoundException(
                    "Topic does not exist.",
                    ApiHelper.ErrorCodes.RESOURCE_NOT_FOUND);
            }

            // Update order
            var sessions = (await _sessionRepository.GetAllAsync()).ToDictionary(e => e.Id);
            foreach ( var session in request.SessionOrder )
            {
                if (sessions.TryGetValue(session.SessionId, out var oldSession))
                {
                    await _sessionRepository.UpdateAsync(
                        oldSession, 
                        e => e.OrderInTopic = session.Order);
                }
                else
                {
                    throw new NotFoundException(
                        $"Session with id = {session.SessionId} does not exist.",
                        ApiHelper.ErrorCodes.RESOURCE_NOT_FOUND);
                }
            }
            await _sessionRepository.SaveToDatabaseAsync();

            return new ()
            {
                Data = request,
                Message = "Update session order successfully."
            };  
        }
    }
}
