using System.ComponentModel.DataAnnotations;

namespace Core.Modules.Auth.DTOs.Auth
{
    public class SendConfirmEmailCodeRequestDto
    {
        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email address")]
        public string Email { get; set; }
    }
}
