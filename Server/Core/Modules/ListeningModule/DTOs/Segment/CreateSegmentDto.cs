using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Modules.ListeningModule.DTOs.Segment
{
    public class CreateSegmentDto
    {
        [Required(ErrorMessage = "The {0} field is required")]
        public string Transcript { get; set; }

        [Required(ErrorMessage = "The {0} field is required")]
        public int Order { get; set; }

        [Required(ErrorMessage = "The {0} field is required")]
        public double StartSec { get; set; }

        [Required(ErrorMessage = "The {0} field is required")]
        public double EndSec { get; set; }
    }
}
