using Core.Modules.BasicListening.Enums;
using Core.Modules.ToeicPractice.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Core.Shared.DTOs.Topic
{
    public class TopicListItemDto
    {
        public int Id { get; set; }
        [JsonConverter(typeof(JsonStringEnumConverter))]
        public ToeicPartType Type { get; set; }
        public string Name { get; set; }
        public string ThumbnailUrl { get; set; }
        public string Description { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
