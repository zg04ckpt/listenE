using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace Core.Modules.BasicListening.DTOs.Segment
{
    public class CheckSegmentResultDto
    {
        public int SegmentId { get; set; }
        public List<WordCorrectListItem> CheckedWords { get; set; }
        public int Redundancy { get; set; }
        public double RedundancyRate { get; set; }
        public double CorrectRate { get; set; }
        public int Score { get; set; }
        public int MaxScore { get; set; } = 100;
        public string CorrectTranscript { get; set; }
    }
}
