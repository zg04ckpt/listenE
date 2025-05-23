
using Core.Modules.ToeicPractice.DTOs.Tag;
using Core.Shared.DTOs;
using Core.Shared.Wrappers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Modules.ToeicPractice.Interfaces.IService
{
    public interface IToeicQuestionTagService
    {
        Task<ApiResult<Paginated<ToeicQuestionTagListItemDto>>> GetAllTags(TagSearchDto data);
        Task<ApiResult<ToeicQuestionTagListItemDto[]>> CreateTags(CreateNewTagsDto data);
        Task<ApiResult<UpdateResponseDto>> UpdateTag(int id, UpdateTagDto data);
        Task<ApiResult<DeleteResponseDto[]>> DeleteTags(DeleteTagsDto data);
    }
}
