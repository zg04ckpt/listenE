namespace Core.Modules.Auth.Entities
{
    public class UserRole
    {
        public int RoleId { get; set; }
        public int UserId { get; set; }

        // Rela
        public User User { get; set; }
        public Role Role { get; set; }
    }
}
