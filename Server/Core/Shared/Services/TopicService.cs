using Core.Shared.DTOs;
using Core.Shared.DTOs.Topic;
using Core.Shared.Entities;
using Core.Shared.Exceptions;
using Core.Shared.Interfaces.IRepository;
using Core.Shared.Interfaces.IService;
using Core.Shared.Utilities;
using Core.Shared.Wrappers;

namespace Core.Shared.Services
{
    public class TopicService : ITopicService
    {
        private readonly IBaseRepository<Topic> _topicRepository;
        private readonly IStorageService _storageService;

        public TopicService(
            IBaseRepository<Topic> topicRepository,
            IStorageService storageService)
        {
            _topicRepository = topicRepository;
            _storageService = storageService;
        }

        public async Task<ApiResult<TopicListItemDto>> GetTopicDetail(int id)
        {
            var detail = await _topicRepository.FindAsync(
                predicate: e => e.Id == id,
                projection: e => new TopicListItemDto
                {
                    Id = e.Id,
                    Name = e.Name,
                    ThumbnailUrl = e.ThumbnailUrl,
                    Description = e.Description,
                    Type = e.Type,
                    CreatedAt = e.CreatedAt,
                    UpdatedAt = e.UpdatedAt,
                })
                ?? throw new NotFoundException(
                    "Topic does not exist", 
                    ApiHelper.ErrorCodes.RESOURCE_NOT_FOUND);
            return new ApiResult<TopicListItemDto>
            {
                Data = detail
            };
        }

        public async Task<ApiResult<TopicListItemDto[]>> GetTopics()
        {
            return new ApiResult<TopicListItemDto[]>
            {
                Message = null,
                Data = (await _topicRepository.GetAllAsync(
                    e => true, 
                    e => new TopicListItemDto
                {
                    Id = e.Id,
                    Name = e.Name,
                    ThumbnailUrl = e.ThumbnailUrl,
                    Description = e.Description,
                    Type = e.Type,
                    CreatedAt = e.CreatedAt,
                    UpdatedAt = e.UpdatedAt,
                })).ToArray()
            };
        }

        public async Task<ApiResult<UpdateResponseDto>> UpdateTopic(int id, UpdateTopicDto request)
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
    }
}
