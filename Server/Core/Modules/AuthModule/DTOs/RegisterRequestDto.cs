
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Modules.AuthModule.DTOs
{
    public class RegisterRequestDto
    {
        [Required(ErrorMessage = "The {0} field cannot be null or empty.")]
        [MaxLength(50, ErrorMessage = "The {0} field must not exceed {1} characters.")]
        [RegularExpression(@"^[\p{L}\p{M}\s]+$",
            ErrorMessage = "The {0} field must only contain letters and spaces, no special characters or numbers are allowed.")]
        public string LastName { get; set; }


        [Required(ErrorMessage = "FirstName cannot be null or empty.")]
        [MaxLength(20, ErrorMessage = "The {0} field must not exceed {1} characters.")]
        [RegularExpression(@"^[\p{L}\p{M}\s]+$",
            ErrorMessage = "The {0} field must not contain special characters, only letters are allowed.")]
        public string FirstName { get; set; }


        [Required(ErrorMessage = "Email cannot be null or empty")]
        [EmailAddress(ErrorMessage = "Invalid email")]
        public string Email { get; set; }


        [Required(ErrorMessage = "Password cannot be null or empty")]
        [RegularExpression("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[.@!#*]).{8,16}$",
            ErrorMessage = "Password must be 8 to 16 characters long and contain at least one lowercase letter, one uppercase letter, one digit, and one special character .@!#*")]

        public string Password { get; set; }


        [Required(ErrorMessage = "ConfirmPassword cannot be null or empty")]
        [Compare("Password", ErrorMessage = "The {0} field must be the same as Password.")]
        public string ConfirmPassword { get; set; }
    }
}
