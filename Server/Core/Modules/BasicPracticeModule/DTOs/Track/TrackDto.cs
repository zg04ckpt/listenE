using Core.Modules.BasicListening.DTOs.Segment;

namespace Core.Modules.BasicListening.DTOs.Track
{
    public class TrackDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string FullAudioTranscript { get; set; }
        public string FullAudioUrl { get; set; }
        public TimeSpan FullAudioDuration { get; set; }
        public List<SegmentDto> Segments { get; set; }
        public DateTime UpdatedAt { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
