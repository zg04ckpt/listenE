using Core.Shared.Entities;

namespace Core.Modules.ListeningModule.Entities
{
    public class Segment : ChangeableEntity<int>
    {
        public string Transcript { get; set; }
        public string AudioUrl { get; set; }
        public int OrderInTrack { get; set; }
        public TimeSpan Duration { get; set; }
        public int TrackId { get; set; }

        // Rela
        public Track Track { get; set; }
    }
}
