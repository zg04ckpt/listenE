namespace Core.Modules.ToeicPractice.DTOs.Part2
{
    public class Part2QuestionDto : QuestionListItemDto
    {
        public string AudioUrl { get; set; }
        public ToeicAnswerDto[] Answers { get; set; }
    }
}
