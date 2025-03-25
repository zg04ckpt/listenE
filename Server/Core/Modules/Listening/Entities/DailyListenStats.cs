using Core.Modules.AuthModule.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Modules.Listening.Entities
{
    public class DailyListenStats
    {
        public int Id { get; set; }
        public int SegmentCount { get; set; }
        public DateTime Date { get; set; }
        public int CorrectWordCount { get; set; }
        public int IncorrectWordCount { get; set; }
        public int FullSegmentCorrectCount { get; set; }
        public Guid UserId { get; set; }

        // Rela
        public User User { get; set; }
    }
}
