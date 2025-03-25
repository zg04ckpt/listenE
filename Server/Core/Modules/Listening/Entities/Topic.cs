using Core.Shared.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Modules.Listening.Entities
{
    public class Topic : ChangeableEntity<int>
    {
        public string Name { get; set; }
        public string ThumbnailUrl { get; set; }
        public string Description { get; set; }

        // Rela
        public List<Session> Sessions { get; set; }
    }
}
