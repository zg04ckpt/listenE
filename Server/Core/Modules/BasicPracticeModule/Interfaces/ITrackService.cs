using Core.Modules.BasicListening.DTOs.Segment;
using Core.Modules.BasicListening.DTOs.Track;
using Core.Shared.DTOs;
using Core.Shared.Wrappers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Modules.BasicListening.Interfaces
{
    public interface ITrackService
    {
        Task<ApiResult<TrackDto>> GetTrackContent(int trackId);
        Task<ApiResult<Paginated<TrackListItemDto>>> GetAllTracks(TrackSearchDto data);
        Task<ApiResult<TrackCreateResponseDto>> CreateNewTrack(CreateTrackDto request);
        Task<ApiResult<DeleteResponseDto>> DeleteTrack(int trackId);
        Task<ApiResult<UpdateResponseDto>> UpdateTrack(int trackId, UpdateTrackDto request);
        Task<ApiResult<CheckSegmentResultDto>> CheckSegment(int segmentId, CheckSegmentDto request);

    }
}
