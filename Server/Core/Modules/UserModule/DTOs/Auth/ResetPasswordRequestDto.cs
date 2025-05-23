using System.ComponentModel.DataAnnotations;

namespace Core.Modules.Auth.DTOs.Auth
{
    public class ResetPasswordRequestDto
    {
        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email address")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Password cannot be null or empty")]
        [RegularExpression("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[.@!#*]).{8,16}$",
            ErrorMessage = "Password must be 8 to 16 characters long and contain at least one lowercase letter, one uppercase letter, one digit, and one special character .@!#*")]
        public string Password { get; set; }


        [Required(ErrorMessage = "ConfirmPassword cannot be null or empty")]
        [Compare("Password", ErrorMessage = "The {0} field must be the same as Password.")]
        public string ConfirmPassword { get; set; }

        [RegularExpression("^[0-9]{6}$",
            ErrorMessage = "{0} field must contain only digits and be 6 characters long.")]
        public string ConfirmCode { get; set; }
    }
}
