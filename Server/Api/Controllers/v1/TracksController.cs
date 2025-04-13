using Core.Modules.ListeningModule.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
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

        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetContent(int id)
        {
            return await TryExecute(() => _trackService.GetTrackContent(id));
        }


        [HttpDelete("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> Delete(int id)
        {
            return await TryExecute(() => _trackService.DeleteTrack(id));
        }
    }
}
