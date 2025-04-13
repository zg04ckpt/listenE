using Core.Modules.AuthModule.Entities;
using Core.Modules.ListeningModule.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Modules.UserModule.Entities
{
    public class FavouriteTrack
    {
        public int UserId { get; set; }
        public int TrackId { get; set; }
        public DateTime SavedAt { get; set; }

        // Rela
        public User User { get; set; }
        public Track Track { get; set; }
    }
}
