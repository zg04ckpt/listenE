using Core.Shared.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Modules.Listening.Entities
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
