using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace Core.Modules.ToeicPractice.DTOs.Part1
{
    public class CreateOrUpdatePart1QuestionDto
    {
        public IFormFile? Image { get; set; }

        public IFormFile? Audio { get; set; }

        [Required(ErrorMessage = "The {0} field is required")]
        [Range(1, 4, ErrorMessage = "{0} must be between 1 and 4")]
        public int CorrectAnswer { get; set; }
        
        [Required(ErrorMessage = "The {0} field is required")]
        public string Transcript { get; set; }

        [Required(ErrorMessage = "The {0} field is required")]
        public string Explanation { get; set; }

        [Required(ErrorMessage = "The {0} field is required")]
        public int TagId { get; set; }
        public List<CreateOrUpdateAnswerDto> Answers { get; set; }
    }
}
