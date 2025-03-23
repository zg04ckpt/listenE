namespace Core.Modules.AuthModule.Entities
{
    public class User
    {
        public Guid Id { get; set; }
        public string Email { get; set; }
        public string ImageUrl { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string PasswordHash { get; set; }
        public DateTime LastLogin { get; set; }
        public bool IsActivated { get; set; }
        public bool IsEmailConfirmed { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        // Rela
        public List<UserRole> UserRoles { get; set; }
    }
}
