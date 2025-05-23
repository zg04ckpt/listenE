namespace Core.Modules.BasicListening.DTOs.Track
{
    public class TrackCreateResponseDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string FullAudioUrl { get; set; }
        public string FullAudioTranscript { get; set; }
        public TimeSpan FullAudioDuration { get; set; }
        public int OrderInSession { get; set; }
        public int SegmentCount { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
