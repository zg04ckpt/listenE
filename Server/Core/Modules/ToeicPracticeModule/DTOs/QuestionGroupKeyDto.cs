using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Modules.ToeicPractice.DTOs
{
    public class QuestionGroupKeyDto
    {
        public int GroupId { get; set; }
        public string Transcript { get; set; }
        public QuestionGroupKeyItemDto[] QuestionKeys { get; set; }
    }

    public class QuestionGroupKeyItemDto
    {
        public string Explanation { get; set; }
        public int CorrectKey { get; set; }
        public int QuestionId { get; set; }
    }
}
