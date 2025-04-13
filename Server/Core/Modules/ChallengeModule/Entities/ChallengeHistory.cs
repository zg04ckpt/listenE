using Core.Modules.AuthModule.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Modules.ChallengeModule.Entities
{
    public class ChallengeHistory
    {
        public int Id { get; set; }
        public int ChallengeId { get; set; }
        public int UserId { get; set; }
        public int CorrectWordCount { get; set; }
        public int TotalWordCount { get; set; }
        public TimeSpan Duration { get; set; }

        // Rela
        public User User { get; set; }
        public Challenge Challenge { get; set; }
    }
}
