using Core.Modules.ToeicPractice.DTOs;
using Core.Modules.ToeicPractice.DTOs.Part1;
using Core.Modules.ToeicPractice.DTOs.Part2;
using Core.Modules.ToeicPractice.DTOs.Part34;
using Core.Shared.DTOs;
using Core.Shared.Wrappers;
using System.Security.Claims;

namespace Core.Modules.ToeicPractice.Interfaces.IService
{
    public interface IToeicQuestionService
    {
        Task<ApiResult<QuestionKeyDto>> GetQuestionCorrectAnswerAsync(int questionId, ClaimsPrincipal claims);
        Task<ApiResult<Paginated<QuestionListItemDto>>> GetQuestionsAsync(QuestionSearchDto data, ClaimsPrincipal claims);
        Task<ApiResult<DeleteResponseDto>> DeleteQuestion(int questionId);


        #region Part 1
        Task<ApiResult<Part1QuestionDto>> GetPart1Question(int questionId);
        Task<ApiResult<Part1QuestionDto>> CreateNewPart1Question(CreateOrUpdatePart1QuestionDto data);
        Task<ApiResult<UpdateResponseDto>> UpdatePart1Question(int id, CreateOrUpdatePart1QuestionDto data);
        #endregion

        #region Part 2
        Task<ApiResult<Part2QuestionDto>> GetPart2Question(int questionId);
        Task<ApiResult<Part2QuestionDto>> CreateNewPart2Question(CreateOrUpdatePart2QuestionDto data);
        Task<ApiResult<UpdateResponseDto>> UpdatePart2Question(int id, CreateOrUpdatePart2QuestionDto data);
        #endregion

        #region Part 3,4
        Task<ApiResult<QuestionGroupKeyDto>> GetPart34QuestionGroupAnswerKeysAsync(int groupId, ClaimsPrincipal claims);
        Task<ApiResult<Part34QuestionGroupDto>> GetPart34QuestionGroupAsync(int groupId);
        Task<ApiResult<Part34QuestionGroupDto>> CreatePart34GroupQuestion(CreateOrUpdatePart34QuestionGroupDto data);
        Task<ApiResult<UpdateResponseDto>> UpdatePart34QuestionGroup(int id, CreateOrUpdatePart34QuestionGroupDto data);
        Task<ApiResult<Paginated<Part34QuestionGroupListItemDto>>> GetPart34QuestionsGroupsAsync(
            Part34QuestionGroupSearchDto data, ClaimsPrincipal claims);
        Task<ApiResult<DeleteResponseDto>> DeletePart34QuestionGroupAsync(int id);
        #endregion
    }
}
