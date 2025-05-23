using Core.Modules.ToeicPractice.Enums;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Core.Modules.ToeicPractice.DTOs.Tag
{
    public class CreateNewTagsDto
    {
        public string[] Tags { get; set; }

        [Required(ErrorMessage = "{0} is required")]
        [JsonConverter(typeof(JsonStringEnumConverter))]
        public ToeicPartType Type { get; set; }
    }
}
