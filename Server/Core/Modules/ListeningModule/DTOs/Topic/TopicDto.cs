using Core.Modules.ListeningModule.DTOs.Session;
using Core.Modules.ListeningModule.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Core.Modules.ListeningModule.DTOs.Topic
{
    public class TopicDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string ThumbnailUrl { get; set; }
        public string Description { get; set; }
        public int SessionCount { get; set; }

        [JsonConverter(typeof(JsonStringEnumConverter))]
        public TopicLevel Level { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
