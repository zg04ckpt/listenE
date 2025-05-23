using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Modules.BasicListening.DTOs.Segment
{
    public class CheckSegmentDto
    {
        [Required(ErrorMessage = "The {0} field is required")]
        public string Content { get; set; }
    }
}
