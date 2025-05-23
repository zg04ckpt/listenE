using Core.Modules.BasicListening.DTOs.Segment;
using Core.Modules.BasicListening.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers.v1
{
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiVersion("1.0")]
    [ApiController]
    public class SegmentsController : BaseApiController
    {
        private readonly ITrackService _trackService;

        public SegmentsController(
            ILogger<SegmentsController> logger,
            ITrackService trackService) : base(logger)
        {
            _trackService = trackService;
        }

        [HttpPost("{id}/checking")]
        public async Task<IActionResult> CheckSegment(int id, [FromBody] CheckSegmentDto request)
        {
            return await TryExecute(() => _trackService.CheckSegment(id, request));
        }
    }
}
