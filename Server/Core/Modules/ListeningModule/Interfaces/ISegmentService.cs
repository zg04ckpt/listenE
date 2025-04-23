using Core.Modules.ListeningModule.DTOs.Segment;
using Core.Shared.Wrappers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Modules.ListeningModule.Interfaces
{
    public interface ISegmentService
    {
        Task<ApiResult<CheckSegmentResultDto>> CheckSegment(int segmentID, CheckSegmentDto request);
    }
}
