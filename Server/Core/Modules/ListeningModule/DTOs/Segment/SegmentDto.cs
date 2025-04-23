using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Modules.ListeningModule.DTOs.Segment
{
    public class SegmentDto
    {
        public int Id { get; set; }
        public string Transcript { get; set; }
        public string AudioUrl { get; set; }
        public TimeSpan SegmentDuration { get; set; }
        public double StartSec { get; set; }
        public double EndSec { get; set; }
        public int OrderInTrack { get; set; }
        public DateTime UpdatedAt { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
