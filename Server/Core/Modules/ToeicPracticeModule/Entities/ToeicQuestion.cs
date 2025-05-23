using Core.Modules.BasicListening.Entities;
using Core.Modules.ToeicPractice.Enums;
using Core.Modules.ToeicPracticeModule.Entities;
using Core.Shared.Entities;

namespace Core.Modules.ToeicPractice.Entities
{
    public class ToeicQuestion : ChangeableEntity<int>
    {
        public string? AudioUrl { get; set; }
        public string? StringQuestion { get; set; }
        public string? ImageUrl { get; set; }
        public string Explanation { get; set; }
        public string? Transcript { get; set; }
        public int CorrectAnswerKey { get; set; }
        public int? GroupId { get; set; }
        public int TagId { get; set; }
        public ToeicQuestionTag Tag { get; set; }
        public ToeicQuestionGroup? Group { get; set; }
        public List<ToeicAnswer> Answers { get; set; }
        public List<CompletedQuestion> CompletedQuestions { get; set; }
    }
}
