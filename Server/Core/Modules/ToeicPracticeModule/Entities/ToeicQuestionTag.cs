using Core.Modules.ToeicPractice.Enums;
using Core.Shared.Entities;

namespace Core.Modules.ToeicPractice.Entities
{
    public class ToeicQuestionTag : ChangeableEntity<int>
    {
        public string Name { get; set; }
        public ToeicPartType Type { get; set; }
        public List<ToeicQuestion> Questions { get; set; }
        public List<ToeicQuestionGroup> QuestionGroups { get; set; }
    }
}
