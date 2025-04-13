using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Modules.ListeningModule.DTOs.Session
{
    public class SessionDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int OrderInTopic { get; set; }
        public int TrackCount { get; set; }
        public int TopicId { get; set; }
        public string TopicName { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
