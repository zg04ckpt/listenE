using Core.Shared.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Modules.ListeningModule.Entities
{
    public class Session : ChangeableEntity<int>
    {
        public string Name { get; set; }
        public int OrderInTopic { get; set; }
        public int TopicId { get; set; }

        // Rela
        public Topic Topic { get; set; }
        public List<Track> Tracks { get; set; }
    }
}
