using Core.Shared.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Modules.ChallengeModule.Entities
{
    public class Challenge : ChangeableEntity<int>
    {
        public string Name { get; set; }
        public string ThumbnailUrl { get; set; }
        public string AudioUrl { get; set; }
        public string Transcript { get; set; }
        public int WordCount { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }

        // Rela
        public List<ChallengeHistory> ChallengeHistories { get; set; }
    }
}
