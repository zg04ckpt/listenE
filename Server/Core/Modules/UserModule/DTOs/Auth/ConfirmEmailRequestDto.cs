using System.ComponentModel.DataAnnotations;

namespace Core.Modules.Auth.DTOs.Auth
{
    public class ConfirmEmailRequestDto
    {
        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email address")]
        public string Email { get; set; }

        [RegularExpression("^[0-9]{6}$",
            ErrorMessage = "{0} field must contain only digits and be 6 characters long.")]
        public string ConfirmCode { get; set; }
    }
}
