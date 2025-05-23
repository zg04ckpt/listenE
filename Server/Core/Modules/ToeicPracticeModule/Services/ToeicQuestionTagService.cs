using Core.Modules.ToeicPractice.DTOs.Tag;
using Core.Modules.ToeicPractice.Entities;
using Core.Modules.ToeicPractice.Interfaces.IService;
using Core.Shared.DTOs;
using Core.Shared.Exceptions;
using Core.Shared.Interfaces.IRepository;
using Core.Shared.Utilities;
using Core.Shared.Wrappers;

namespace Core.Modules.ToeicPractice.Services
{
    public class ToeicQuestionTagService : IToeicQuestionTagService
    {
        private readonly IBaseRepository<ToeicQuestionTag> _tagRepository;

        public ToeicQuestionTagService(IBaseRepository<ToeicQuestionTag> tagRepository)
        {
            _tagRepository = tagRepository;
        }

        public async Task<ApiResult<ToeicQuestionTagListItemDto[]>> CreateTags(CreateNewTagsDto data)
        {
            var existingTagNames = (await _tagRepository
                .GetAllAsync(e => e.Type == data.Type, projection: e => e.Name))
                .ToHashSet();
            var tags = new List<ToeicQuestionTag>();
            foreach (var tag in data.Tags.ToHashSet())
            {
                if (existingTagNames.Contains(tag.Trim()))
                {
                    continue;
                }
                tags.Add(new ToeicQuestionTag
                {
                    Name = tag.Trim(),
                    Type = data.Type,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                });
            }
            await _tagRepository.AddRangeAsync(tags);
            await _tagRepository.SaveToDatabaseAsync();

            return new ApiResult<ToeicQuestionTagListItemDto[]>
            {
                Data = tags.Select(e => new ToeicQuestionTagListItemDto
                {
                    Name = e.Name,
                    Id = e.Id,
                    Type = e.Type,
                }).ToArray()
            };
        }

        public async Task<ApiResult<DeleteResponseDto[]>> DeleteTags(DeleteTagsDto data)
        {
            var set = data.TagIds.ToHashSet();
            var existingTags = await _tagRepository.GetAllAsync(
                predicate: e => set.Contains(e.Id));
            await _tagRepository.DeleteRangeAsync(existingTags);
            await _tagRepository.SaveToDatabaseAsync();

            return new ApiResult<DeleteResponseDto[]>
            {
                Message = "Delete tags successfully",
                Data = existingTags.Select(e => new DeleteResponseDto
                {
                    Id = e.Id,
                }).ToArray()
            };
        }

        public async Task<ApiResult<Paginated<ToeicQuestionTagListItemDto>>> GetAllTags(TagSearchDto data)
        {
            var predicateBuilder = new PredicateBuilder<ToeicQuestionTag>();
            if (data.Type != null)
            {
                predicateBuilder.AndCondition(e => e.Type == data.Type);
            }
            if (data.Name != null)
            {
                predicateBuilder.AndCondition(e => e.Name.Contains(data.Name));
            }

            return new ApiResult<Paginated<ToeicQuestionTagListItemDto>>
            {
                Data = (await _tagRepository.GetPaginatedAsync(
                    predicate: predicateBuilder.GetPredicateOrDefault(),
                    page: data.Page,
                    size: data.Size,
                    sortBy: e => e.Name,
                    isAsc: true,
                    projection: e => new ToeicQuestionTagListItemDto
                    {
                        Id = e.Id,
                        Name = e.Name,
                        Type = e.Type,
                    }))
            };
        }

        public async Task<ApiResult<UpdateResponseDto>> UpdateTag(int id, UpdateTagDto data)
        {
            if (await _tagRepository.ExistsAsync(e => e.Name == data.Name))
            {
                throw new BadRequestException("Tag name already exists or not change.");
            }
            var tag = await _tagRepository.FindAsync(e => e.Id == id)
                ?? throw new NotFoundException(
                    "Tag does not exist.",
                    ApiHelper.ErrorCodes.RESOURCE_NOT_FOUND);
            await _tagRepository.UpdateAsync(tag, e =>
            {
                e.Name = data.Name;
                e.Type = data.Type;
                e.UpdatedAt = DateTime.UtcNow;
            });
            await _tagRepository.SaveToDatabaseAsync();

            return new ApiResult<UpdateResponseDto>
            {
                Message = "Update tag successfully",
                Data = new UpdateResponseDto
                {
                    Id = tag.Id,
                    UpdatedAt = tag.UpdatedAt,
                }
            };
        }
    }
}
