using Core.Modules.ToeicPractice.Enums;
using Core.Shared.DTOs;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Core.Modules.ToeicPractice.DTOs.Tag
{
    public class TagSearchDto : PagingRequestBaseDTO
    {

        [JsonConverter(typeof(JsonStringEnumConverter))]
        public ToeicPartType? Type { get; set; }
    }
}
