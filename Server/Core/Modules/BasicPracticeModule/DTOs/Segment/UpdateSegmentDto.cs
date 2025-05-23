using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Modules.BasicListening.DTOs.Segment
{
    public class UpdateSegmentDto
    {
        public int? Id { get; set; }

        [Required(ErrorMessage = "The {0} field is required")]
        public string Transcript { get; set; }

        [Required(ErrorMessage = "The {0} field is required")]
        public int OrderInTrack { get; set; }

        [Required(ErrorMessage = "The {0} field is required")]
        public double StartSec { get; set; }

        [Required(ErrorMessage = "The {0} field is required")]
        public double EndSec { get; set; }
    }
}
