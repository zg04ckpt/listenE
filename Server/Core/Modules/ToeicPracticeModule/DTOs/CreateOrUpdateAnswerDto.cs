using System.ComponentModel.DataAnnotations;

namespace Core.Modules.ToeicPractice.DTOs
{
    public class CreateOrUpdateAnswerDto
    {
        [Required(ErrorMessage = "The {0} field is required")]
        public string Content { get; set; }
    }
}
