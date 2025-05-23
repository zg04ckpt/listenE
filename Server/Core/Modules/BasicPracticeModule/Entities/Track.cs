using Core.Shared.Entities;

namespace Core.Modules.BasicListening.Entities
{
    public class Track : ChangeableEntity<int>
    {
        public string Name { get; set; }
        public string FullAudioUrl { get; set; }
        public string FullAudioTranscript { get; set; }
        public TimeSpan FullAudioDuration { get; set; }
        public int Order { get; set; }

        // Rela
        public List<Segment> Segments { get; set; }
    }
}
