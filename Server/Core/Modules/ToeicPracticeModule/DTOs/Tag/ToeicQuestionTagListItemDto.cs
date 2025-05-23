using Core.Modules.ToeicPractice.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Core.Modules.ToeicPractice.DTOs.Tag
{
    public class ToeicQuestionTagListItemDto
    {
        public int Id { get; set; }
        public string Name { get; set; }

        [JsonConverter(typeof(JsonStringEnumConverter))]
        public ToeicPartType Type { get; set; }
    }
}
