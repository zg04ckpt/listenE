using Core.Modules.ListeningModule.DTOs.Segment;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Modules.ListeningModule.DTOs.Track
{
    public class TrackContentDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string FullAudioTranscript { get; set; }
        public string FullAudioUrl { get; set; }
        public TimeSpan FullAudioDuration { get; set; }
        public List<SegmentInTrackDto> Segments { get; set; }
    }

  
}
