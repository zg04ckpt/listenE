using System.ComponentModel.DataAnnotations;

namespace Core.Modules.ListeningModule.DTOs.Session
{
    public class UpdateSessionDto
    {
        [Required(ErrorMessage = "The {0} field is required")]
        [MaxLength(255, ErrorMessage = "The {0} field must not exceed {1} characters.")]
        public string Name { get; set; }
    }
}
