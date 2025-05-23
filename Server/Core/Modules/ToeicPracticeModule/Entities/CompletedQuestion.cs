using Core.Modules.Auth.Entities;
using Core.Modules.ToeicPractice.Entities;

namespace Core.Modules.ToeicPracticeModule.Entities
{
    public class CompletedQuestion
    {
        public int UserId { get; set; }
        public int QuestionId { get; set; }
        public DateTime CompletedAt { get; set; }
        public User User { get; set; }
        public ToeicQuestion Question { get; set; }
    }
}
