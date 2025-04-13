using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Modules.ListeningModule.DTOs.Track
{
    public class UpdateTrackDto 
    {
        public string Name { get; set; }
        public string FullAudioUrl { get; set; }
        public string FullAudioTranscript { get; set; }
        public TimeSpan FullAudioDuration { get; set; }
        public int OrderInSession { get; set; }
        public int SessionId { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
