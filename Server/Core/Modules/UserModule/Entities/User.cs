using Core.Modules.ToeicPracticeModule.Entities;
using Core.Shared.Entities;

namespace Core.Modules.Auth.Entities
{
    public class User : ChangeableEntity<int>
    {
        public string Email { get; set; }
        public string ImageUrl { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string PasswordHash { get; set; }
        public DateTime LastLogin { get; set; }
        public bool IsActivated { get; set; }
        public bool IsEmailConfirmed { get; set; }

        // Rela
        public List<UserRole> UserRoles { get; set; }
        public List<CompletedQuestion> CompletedQuestions { get; set; }
    }
}
