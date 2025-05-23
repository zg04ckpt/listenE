using Core.Modules.ToeicPractice.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Core.Modules.ToeicPractice.DTOs
{
    public class GroupListItemDto
    {
        public int GroupId { get; set; }
        [JsonConverter(typeof(JsonStringEnumConverter))]
        public ToeicPartType Type { get; set; }
    }
}
