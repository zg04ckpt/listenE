using Core.Shared.DTOs;
using Core.Shared.DTOs.Topic;
using Core.Shared.Wrappers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Shared.Interfaces.IService
{
    public interface ITopicService
    {
        Task<ApiResult<TopicListItemDto[]>> GetTopics();
        Task<ApiResult<UpdateResponseDto>> UpdateTopic(int id, UpdateTopicDto request);
        Task<ApiResult<TopicListItemDto>> GetTopicDetail(int id);
    }
}
