using Core.Modules.ListeningModule.DTOs.Segment;
using Core.Modules.ListeningModule.DTOs.Track;
using Core.Shared.DTOs;
using Core.Shared.Wrappers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Modules.ListeningModule.Interfaces
{
    public interface ITrackService
    {
        
        Task<ApiResult<TrackListItemDto[]>> GetTracksOfSession(int sessionId);
        Task<ApiResult<TrackDto>> GetTrackContent(int trackId);
        Task<ApiResult<TrackCreateResponseDto>> CreateNewTrackInSession(int sessionId, CreateTrackDto request);
        Task<ApiResult<DeleteResponseDto>> DeleteTrack(int trackId);
        Task<ApiResult<UpdateResponseDto>> UpdateTrack(int trackId, UpdateTrackDto request);
    }
}
