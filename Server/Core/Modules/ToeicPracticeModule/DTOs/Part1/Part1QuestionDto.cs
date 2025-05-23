namespace Core.Modules.ToeicPractice.DTOs.Part1
{
    public class Part1QuestionDto : QuestionListItemDto
    {
        public string ImageUrl { get; set; }
        public string AudioUrl { get; set; } 
        public ToeicAnswerDto[] Answers { get; set; }
    }
}
