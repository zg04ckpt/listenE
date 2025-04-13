using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Modules.ListeningModule.DTOs.Session
{
    public class SessionListItemDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int OrderInTopic { get; set; }
        public int TopicId { get; set; }
        public int TrackCount { get; set; }
    }
}
