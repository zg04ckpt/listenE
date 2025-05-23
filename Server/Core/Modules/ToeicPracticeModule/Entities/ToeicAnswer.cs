namespace Core.Modules.ToeicPractice.Entities
{
    public class ToeicAnswer
    {
        public int Id { get; set; }
        public int Key { get; set; }
        public string Content { get; set; }
        public int QuestionId { get; set; }
        public ToeicQuestion Question { get; set; }
    }
}
