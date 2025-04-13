using Core.Modules.ListeningModule.DTOs.Session;
using Core.Modules.ListeningModule.DTOs.Topic;
using Core.Modules.ListeningModule.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers.v1
{
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiController]
    [ApiVersion("1")]
    public class TopicsController : BaseApiController
    {
        private readonly ITopicService _topicService;
        private readonly ISessionService _sessionService;

        public TopicsController(
            ITopicService topicService,
            ILogger<TopicsController> _logger,
            ISessionService sessionService) : base(_logger)
        {
            _topicService = topicService;
            _sessionService = sessionService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllTopic()
        {
            return await TryExecute(() => _topicService.GetTopics());
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetTopic(int id)
        {
            return await TryExecute(() => _topicService.GetTopic(id));
        }

        [HttpGet("{topicId}/sessions")]
        public async Task<IActionResult> GetAllSessions(int topicId)
        {
            return await TryExecute(() => _sessionService.GetSessionsOfTopic(topicId));
        }

        [HttpPost]
        public async Task<IActionResult> CreateNewTopic([FromForm] CreateOrUpdateTopicDto request)
        {
            return await TryExecute(() => _topicService.CreateNewTopic(request));
        }

        [HttpPost("{topicId}/sessions")]
        public async Task<IActionResult> CreateNewSessionInTopic(int topicId, [FromBody] CreateSessionDto request)
        {
            return await TryExecute(() => _sessionService.CreateNewSession(topicId, request));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTopic(int id, [FromForm] CreateOrUpdateTopicDto request)
        {
            return await TryExecute(() => _topicService.UpdateTopic(id, request));
        }

        [HttpPut("{topicId}/session-order")]
        public async Task<IActionResult> UpdateSessionOrderTopic(int topicId, [FromBody] UpdateSessionOrderDto request)
        {
            return await TryExecute(() => _topicService.UpdateTopicSessionOrder(topicId, request));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTopic(int id)
        {
            return await TryExecute(() => _topicService.DeleteTopic(id));
        }
    }
}
