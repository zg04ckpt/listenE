using Core.Modules.ListeningModule.DTOs.Session;
using Core.Modules.ListeningModule.DTOs.Topic;
using Core.Modules.ListeningModule.DTOs.Track;
using Core.Modules.ListeningModule.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers.v1
{
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiController]
    [ApiVersion("1.0")]
    public class SessionsController : BaseApiController
    {
        private readonly ISessionService _sessionService;
        private readonly ITrackService _trackService;

        public SessionsController(
            ISessionService sessionService,
            ILogger<TopicsController> _logger,
            ITrackService trackService) : base(_logger)
        {
            _sessionService = sessionService;
            _trackService = trackService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllSessions([FromQuery] SearchSessionRequestDto request)
        {
            return await TryExecute(() => _sessionService.GetAllSessions(request));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetSession(int id)
        {
            return await TryExecute(() => _sessionService.GetSession(id));
        }

        [HttpGet("{sessionId}/tracks")]
        public async Task<IActionResult> CreateNewTrackInSession(int sessionId)
        {
            return await TryExecute(() => _trackService.GetTracksOfSession(sessionId));
        }

        [HttpPost("{sessionId}/tracks")]
        public async Task<IActionResult> CreateNewTrackInSession(int sessionId, [FromForm] CreateTrackDto request)
        {
            return await TryExecute(() => _trackService.CreateNewTrackInSession(sessionId, request));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSession(int id, [FromBody] UpdateSessionDto request)
        {
            return await TryExecute(() => _sessionService.UpdateSession(id, request));
        }
       
        [HttpPut("{sessionId}/track-order")]
        public async Task<IActionResult> UpdateSessionOrderTopic(int sessionId, [FromBody] UpdateTrackOrderDto request)
        {
            return await TryExecute(() => _sessionService.UpdateTrackOrder(sessionId, request));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSession(int id)
        {
            return await TryExecute(() => _sessionService.DeleteSession(id));
        }
    }
}
