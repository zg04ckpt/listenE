using Core.Modules.BasicListening.DTOs.Track;
using Core.Modules.BasicListening.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers.v1
{
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiController]
    [ApiVersion("1.0")]
    public class TracksController : BaseApiController
    {
        private readonly ITrackService _trackService;

        public TracksController(
            ILogger<TracksController> logger,
            ITrackService trackService): base(logger)
        {
            _trackService = trackService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllTracks([FromQuery] TrackSearchDto request)
        {
            return await TryExecute(() => _trackService.GetAllTracks(request));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetContent(int id)
        {
            return await TryExecute(() => _trackService.GetTrackContent(id));
        }

        [HttpPost]
        [Authorize(Policy = "OnlyManager")]
        public async Task<IActionResult> CreateNewTrack([FromForm] CreateTrackDto request)
        {
            return await TryExecute(() => _trackService.CreateNewTrack(request));
        }

        [HttpPut("{id}")]
        [Authorize(Policy = "OnlyManager")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateTrackDto request)
        {
            return await TryExecute(() => _trackService.UpdateTrack(id, request));
        }

        [HttpDelete("{id}")]
        [Authorize(Policy = "OnlyManager")]
        public async Task<IActionResult> Delete(int id)
        {
            return await TryExecute(() => _trackService.DeleteTrack(id));
        }
    }
}
