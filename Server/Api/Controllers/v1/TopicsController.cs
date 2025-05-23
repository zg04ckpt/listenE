using Core.Modules.BasicListening.Interfaces;
using Core.Shared.DTOs.Topic;
using Core.Shared.Interfaces.IService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers.v1
{
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiController]
    [ApiVersion("1")]
    public class TopicsController : BaseApiController
    {
        private readonly ITopicService _topicService;

        public TopicsController(
            ITopicService topicService,
            ILogger<TopicsController> _logger) : base(_logger)
        {
            _topicService = topicService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllTopic()
        {
            return await TryExecute(() => _topicService.GetTopics());
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetTopic(int id)
        {
            return await TryExecute(() => _topicService.GetTopicDetail(id));
        }


        [HttpPut("{id}")]
        [Authorize(Policy = "OnlyManager")]
        public async Task<IActionResult> UpdateTopic(int id, [FromForm] UpdateTopicDto request)
        {
            return await TryExecute(() => _topicService.UpdateTopic(id, request));
        }
    }
}
