using Core.Modules.ListeningModule.DTOs.Session;
using Core.Shared.DTOs;
using Core.Shared.Wrappers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Modules.ListeningModule.Interfaces
{
    public interface ISessionService
    {
        Task<ApiResult<SessionDto>> CreateNewSession(int topicId, CreateSessionDto request);
        Task<ApiResult<SessionDto>> GetSession(int id);
        Task<ApiResult<SessionListItemDto[]>> GetSessionsOfTopic(int topicId);
        Task<ApiResult<Paginated<SessionListItemDto>>> GetAllSessions(SearchSessionRequestDto request);
        Task<ApiResult<UpdateResponseDto>> UpdateSession(int id, UpdateSessionDto request);
        Task<ApiResult<UpdateTrackOrderDto>> UpdateTrackOrder(int sessionId, UpdateTrackOrderDto request);
        Task<ApiResult<DeleteResponseDto>> DeleteSession(int id);
    }
}
