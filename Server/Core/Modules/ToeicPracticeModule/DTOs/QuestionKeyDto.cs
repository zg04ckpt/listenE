namespace Core.Modules.ToeicPractice.DTOs
{
    public class QuestionKeyDto
    {
        public int CorrectKey { get; set; }
        public string Transcript { get; set; }
        public string Explanation { get; set; }
        public QuestionAnswerKeysDto[] AnswerKeys { get; set; }
    }

    public class QuestionAnswerKeysDto
    {
        public int Key { get; set; }
        public string Content { get; set; }
    }
}
