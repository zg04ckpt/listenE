using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Modules.BasicListening.DTOs.Track
{
    public class UpdateSegmentOrderDto
    {
        public UpdateSegmentOrderListItemDto[] SegmentOrder { get; set; }
    }

    public class UpdateSegmentOrderListItemDto
    {
        public int SegmentId { get; set; }
        public int SegmentOrder { get; set; }
    }
}
