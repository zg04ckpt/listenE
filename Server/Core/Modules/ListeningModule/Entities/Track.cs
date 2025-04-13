
using Core.Modules.UserModule.Entities;
using Core.Shared.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Modules.ListeningModule.Entities
{
    public class Track : ChangeableEntity<int>
    {
        public string Name { get; set; }
        public string FullAudioUrl { get; set; }
        public string FullAudioTranscript { get; set; }
        public TimeSpan FullAudioDuration { get; set; }
        public int OrderInSession { get; set; }
        public int SessionId { get; set; }

        // Rela
        public Session Session { get; set; }
        public List<Segment> Segments { get; set; }
        public List<FavouriteTrack> FavouriteTracks { get; set; }
        public List<TrackHistory> TrackHistories { get; set; }
        public List<Comment> Comments { get; set; }
    }
}
