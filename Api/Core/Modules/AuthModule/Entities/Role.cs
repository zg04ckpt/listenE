namespace Core.Modules.AuthModule.Entities
{
    public class Role
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        // Rela
        public List<UserRole> UserRoles { get; set; }
    }
}
