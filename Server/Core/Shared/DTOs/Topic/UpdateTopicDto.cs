using Core.Modules.BasicListening.Enums;
using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Core.Shared.DTOs.Topic
{
    public class UpdateTopicDto
    {
        [Required(ErrorMessage = "The {0} field is required")]
        [MaxLength(255, ErrorMessage = "The {0} field must not exceed {1} characters.")]
        public string Name { get; set; }

        [Required(ErrorMessage = "The {0} field is required")]
        [MaxLength(1000, ErrorMessage = "The {0} field must not exceed {1} characters.")]
        public string Description { get; set; }
        public IFormFile? Thumbnail { get; set; }
    }
}
