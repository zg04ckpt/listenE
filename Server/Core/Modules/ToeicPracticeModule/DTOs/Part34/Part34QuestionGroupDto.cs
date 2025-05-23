namespace Core.Modules.ToeicPractice.DTOs.Part34
{
    public class Part34QuestionGroupDto
    {
        public int GroupId { get; set; }
        public string GroupName { get; set; }
        public string? ImageUrl { get; set; }
        public string AudioUrl { get; set; }
        public Part34QuestionDto[] Questions { get; set; }
    }
}
