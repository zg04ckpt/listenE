using Core.Modules.ToeicPractice.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Core.Modules.ToeicPractice.DTOs.Part34
{
    public class Part34QuestionGroupListItemDto
    {
        public int GroupId { get; set; }
        public string GroupName { get; set; }
        public int TagId { get; set; }
        public bool IsCompleted { get; set; }
        public string TagName { get; set; }

        [JsonConverter(typeof(JsonStringEnumConverter))]
        public ToeicPartType Type { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
