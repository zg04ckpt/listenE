namespace Core.Modules.ToeicPractice.DTOs.Part34
{
    public class Part34QuestionDto : QuestionListItemDto
    {
        public string StringQuestion { get; set; }
        public ToeicAnswerDto[] Answers { get; set; }
    }
}
