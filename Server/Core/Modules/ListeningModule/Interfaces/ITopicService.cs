using Core.Modules.ListeningModule.DTOs.Topic;
using Core.Shared.DTOs;
using Core.Shared.Wrappers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Modules.ListeningModule.Interfaces
{
    public interface ITopicService
    {
        Task<ApiResult<TopicListItemDto[]>> GetTopics();
        Task<ApiResult<TopicDto>> GetTopic(int id);
        Task<ApiResult<TopicDto>> CreateNewTopic(CreateOrUpdateTopicDto request);
        Task<ApiResult<UpdateResponseDto>> UpdateTopic(int id, CreateOrUpdateTopicDto request);
        Task<ApiResult<UpdateSessionOrderDto>> UpdateTopicSessionOrder(int topicId, UpdateSessionOrderDto request);
        Task<ApiResult<DeleteResponseDto>> DeleteTopic(int id);
    }
}
