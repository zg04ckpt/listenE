using Core.Modules.ToeicPractice.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;

namespace Core.Modules.ToeicPractice.DTOs.Tag
{
    public class UpdateTagDto
    {
        [Required(ErrorMessage = "{0} is required")]
        public string Name { get; set; }

        [Required(ErrorMessage = "{0} is required")]
        [JsonConverter(typeof(JsonStringEnumConverter))]
        public ToeicPartType Type { get; set; }
    }
}
