using Core.Modules.ToeicPractice.DTOs;
using Core.Modules.ToeicPractice.DTOs.Part1;
using Core.Modules.ToeicPractice.DTOs.Part2;
using Core.Modules.ToeicPractice.DTOs.Part34;
using Core.Modules.ToeicPractice.DTOs.Tag;
using Core.Modules.ToeicPractice.Interfaces.IService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers.v1
{
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiController]
    [ApiVersion("1")]
    public class ToeicsController : BaseApiController
    {
        private readonly IToeicQuestionService _toeicPracticeService;
        private readonly IToeicQuestionTagService _toeicQuestionTagService;

        public ToeicsController(
            ILogger<ToeicsController> logger,
            IToeicQuestionService toeicPracticeService,
            IToeicQuestionTagService toeicQuestionTagService) : base(logger)
        {
            _toeicPracticeService = toeicPracticeService;
            _toeicQuestionTagService = toeicQuestionTagService;
        }

        [HttpGet("questions/{id}/correct-ans")]
        public async Task<IActionResult> CheckQuestionKey(int id)
        {
            return await TryExecute(() => 
                _toeicPracticeService.GetQuestionCorrectAnswerAsync(id, User));
        }

        [HttpGet("questions/group/{id}/correct-ans")]
        public async Task<IActionResult> CheckQuestionGroupKey(int id)
        {
            return await TryExecute(() => 
                _toeicPracticeService
                .GetPart34QuestionGroupAnswerKeysAsync(id, User));
        }

        [HttpGet("questions")]
        public async Task<IActionResult> GetAllLQuestions([FromQuery] QuestionSearchDto request)
        {
            return await TryExecute(() => _toeicPracticeService.GetQuestionsAsync(request, User));
        }

        [HttpDelete("questions/{id}")]
        [Authorize(Policy = "OnlyManager")]
        public async Task<IActionResult> DeleteQuestion(int id)
        {
            return await TryExecute(() => _toeicPracticeService.DeleteQuestion(id));
        }

        #region Tag
        [HttpGet("tags")]
        public async Task<IActionResult> GetAllTags([FromQuery] TagSearchDto request)
        {
            return await TryExecute(() => _toeicQuestionTagService.GetAllTags(request));
        }

        [HttpPut("tags/{id}")]
        [Authorize(Policy = "OnlyManager")]
        public async Task<IActionResult> UpdateTag(int id, [FromBody] UpdateTagDto request)
        {
            return await TryExecute(() => _toeicQuestionTagService.UpdateTag(id, request));
        }

        [HttpPost("tags")]
        [Authorize(Policy = "OnlyManager")]
        public async Task<IActionResult> CreateTags([FromBody] CreateNewTagsDto request)
        {
            return await TryExecute(() => _toeicQuestionTagService.CreateTags(request));
        }

        [HttpDelete("tags")]
        [Authorize(Policy = "OnlyManager")]
        public async Task<IActionResult> DeleteTags([FromBody] DeleteTagsDto request)
        {
            return await TryExecute(() => _toeicQuestionTagService.DeleteTags(request));
        }
        #endregion

        #region Part1   
        [HttpGet("part-1/questions/{id}")]
        public async Task<IActionResult> GetPart1Question(int id)
        {
            return await TryExecute(() => _toeicPracticeService.GetPart1Question(id));
        }


        [HttpPost("part-1/questions")]
        [Authorize(Policy = "OnlyManager")]
        public async Task<IActionResult> CreatePart1Question(
            [FromForm] CreateOrUpdatePart1QuestionDto request)
        {
            return await TryExecute(() => _toeicPracticeService.CreateNewPart1Question(request));
        }


        [HttpPut("part-1/questions/{id}")]
        [Authorize(Policy = "OnlyManager")]
        public async Task<IActionResult> UpdatePart1Question(
            int id, 
            [FromForm] CreateOrUpdatePart1QuestionDto request)
        {
            return await TryExecute(() => _toeicPracticeService.UpdatePart1Question(id, request));
        }
        #endregion

        #region Part2  
        [HttpGet("part-2/questions/{id}")]
        public async Task<IActionResult> GetPart2Question(int id)
        {
            return await TryExecute(() => _toeicPracticeService.GetPart2Question(id));
        }


        [HttpPost("part-2/questions")]
        [Authorize(Policy = "OnlyManager")]
        public async Task<IActionResult> CreatePart2Question(
            [FromForm] CreateOrUpdatePart2QuestionDto request)
        {
            return await TryExecute(() => _toeicPracticeService.CreateNewPart2Question(request));
        }


        [HttpPut("part-2/questions/{id}")]
        [Authorize(Policy = "OnlyManager")]
        public async Task<IActionResult> UpdatePart2Question(
            int id,
            [FromForm] CreateOrUpdatePart2QuestionDto request)
        {
            return await TryExecute(() => _toeicPracticeService.UpdatePart2Question(id, request));
        }
        #endregion

        #region Part 3,4
        [HttpGet("part-34/groups")]
        public async Task<IActionResult> GetListPart34QuestionGroups(
            [FromQuery] Part34QuestionGroupSearchDto request)
        {
            return await TryExecute(() => _toeicPracticeService
                .GetPart34QuestionsGroupsAsync(request, User));
        }

        [HttpGet("part-34/groups/{id}")]
        public async Task<IActionResult> GetPart34QuestionsGroup(int id)
        {
            return await TryExecute(() => _toeicPracticeService
                .GetPart34QuestionGroupAsync(id));
        }

        [HttpGet("part-34/groups/{id}/correct-ans")]
        public async Task<IActionResult> GetPart34QuestionsGroupAnswerKey(int id)
        {
            return await TryExecute(() => _toeicPracticeService
                .GetPart34QuestionGroupAnswerKeysAsync(id, User));
        }

        [HttpPost("part-34/groups")]
        [Authorize(Policy = "OnlyManager")]
        public async Task<IActionResult> CreatePart34QuestionsGroup(
            [FromForm] CreateOrUpdatePart34QuestionGroupDto request)
        {
            return await TryExecute(() => _toeicPracticeService
                .CreatePart34GroupQuestion(request));
        }

        [HttpPut("part-34/groups/{id}")]
        [Authorize(Policy = "OnlyManager")]
        public async Task<IActionResult> UpdatePart34QuestionsGroup(
            int id,
            [FromForm] CreateOrUpdatePart34QuestionGroupDto request)
        {
            return await TryExecute(() => _toeicPracticeService
                .UpdatePart34QuestionGroup(id, request));
        }

        [HttpDelete("part-34/groups/{id}")]
        [Authorize(Policy = "OnlyManager")]
        public async Task<IActionResult> DeletePart34QuestionsGroup(int id)
        {
            return await TryExecute(() => _toeicPracticeService
                .DeletePart34QuestionGroupAsync(id));
        }
        #endregion
    }
}
