using Core.Modules.ToeicPractice.Enums;
using Core.Shared.DTOs;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Core.Modules.ToeicPractice.DTOs.Part34
{
    public class Part34QuestionGroupSearchDto : PagingRequestBaseDTO
    {
        public int? TagId { get; set; }

        [JsonConverter(typeof(JsonStringEnumConverter))]
        public ToeicPartType? Type { get; set; }
    }
}
