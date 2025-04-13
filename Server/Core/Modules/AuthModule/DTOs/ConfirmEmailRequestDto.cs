using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Modules.AuthModule.DTOs
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
