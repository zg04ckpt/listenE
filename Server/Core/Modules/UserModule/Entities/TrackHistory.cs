using Core.Modules.AuthModule.Entities;
using Core.Modules.ListeningModule.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Modules.UserModule.Entities
{
    public class TrackHistory
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int TrackId { get; set; }
        public string Progress { get; set; } // 12/20
        public bool IsCompleted { get; set; }
        public DateTime StartedAt { get; set; }

        // Rela
        public User User { get; set; }
        public Track Track { get; set; }
    }
}
