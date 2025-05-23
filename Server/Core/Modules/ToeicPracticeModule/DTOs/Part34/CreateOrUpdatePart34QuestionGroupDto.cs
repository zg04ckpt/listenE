using Core.Modules.ToeicPractice.Enums;
using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Core.Modules.ToeicPractice.DTOs.Part34
{
    public class CreateOrUpdatePart34QuestionGroupDto
    {
        public IFormFile? Image { get; set; }

        public IFormFile? Audio { get; set; }

        [Required(ErrorMessage = "The {0} field is required")]
        public string Transcript { get; set; }

        [Required(ErrorMessage = "The {0} field is required")]
        public int TagId { get; set; }

        public List<CreateOrUpdatePart34QuestionDto> Questions { get; set; }
    }

    public class CreateOrUpdatePart34QuestionDto
    {
        [Required(ErrorMessage = "The {0} field is required")]
        public string StringQuestion { get; set; }

        [Required(ErrorMessage = "The {0} field is required")]
        public string Explanation { get; set; }

        [Required(ErrorMessage = "The {0} field is required")]
        [Range(1, 4, ErrorMessage = "{0} must be between 1 and 4")]
        public int CorrectAnswer { get; set; }
        public List<CreateOrUpdateAnswerDto> Answers { get; set; }
    }
}
