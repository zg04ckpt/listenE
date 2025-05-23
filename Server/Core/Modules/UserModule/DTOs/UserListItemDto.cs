namespace Core.Modules.UserModule.DTOs
{
    public class UserListItemDto
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public string ImageUrl { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateTime LastLogin { get; set; }
        public bool IsActivated { get; set; }
        public bool IsEmailConfirmed { get; set; }
        public DateTime UpdatedAt { get; set; }
        public DateTime CreatedAt { get; set; }
        public string[] Roles { get; set; }
    }
}
