using Core.Modules.ToeicPractice.Enums;
using Core.Shared.DTOs;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Core.Modules.ToeicPractice.DTOs
{
    public class QuestionSearchDto : PagingRequestBaseDTO
    {
        public int? TagId { get; set; }

        [JsonConverter(typeof(JsonStringEnumConverter))]
        public ToeicPartType? Type { get; set; }
    }
}
