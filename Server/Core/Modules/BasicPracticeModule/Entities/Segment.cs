using Core.Shared.Entities;

namespace Core.Modules.BasicListening.Entities
{
    public class Segment : ChangeableEntity<int>
    {
        public string Transcript { get; set; }
        public string AudioUrl { get; set; }
        public int OrderInTrack { get; set; }
        public double StartSec { get; set; }
        public double EndSec { get; set; }
        public int TrackId { get; set; }

        // Rela
        public Track Track { get; set; }
    }
}
