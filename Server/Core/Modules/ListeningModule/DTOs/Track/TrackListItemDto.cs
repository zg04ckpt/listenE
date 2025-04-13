using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Modules.ListeningModule.DTOs.Track
{
    public class TrackListItemDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int OrderInSession { get; set; }
    }
}
