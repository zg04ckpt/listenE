namespace Core.Modules.Auth.DTOs.Auth
{
    public class RegisterResponseDto
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public string ImageUrl { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public bool IsActivated { get; set; }
        public bool IsEmailConfirmed { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
