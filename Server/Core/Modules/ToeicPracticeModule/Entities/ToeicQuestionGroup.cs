using Core.Shared.Entities;

namespace Core.Modules.ToeicPractice.Entities
{
    public class ToeicQuestionGroup : ChangeableEntity<int>
    {
        public string? ImageUrl { get; set; }
        public string AudioUrl { get; set; }
        public string Transcript { get; set; }
        public int TagId { get; set; }
        public ToeicQuestionTag Tag { get; set; }
        public List<ToeicQuestion> Questions { get; set; }
    }
}
