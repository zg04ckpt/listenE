using Core.Modules.ToeicPractice.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Core.Modules.ToeicPractice.DTOs
{
    public class QuestionListItemDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string TagName { get; set; }
        public int TagId { get; set; }
        public bool IsCompleted { get; set; } = false;

        [JsonConverter(typeof(JsonStringEnumConverter))]
        public ToeicPartType Type { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
