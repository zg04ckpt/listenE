using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Modules.ListeningModule.DTOs.Session
{
    public class UpdateTrackOrderDto
    {
        public UpdateTrackOrderListItemDto[] TrackOrder { get; set; }
    }

    public class UpdateTrackOrderListItemDto
    {
        public int TrackId { get; set; }
        public int Order { get; set; }
    }

}
