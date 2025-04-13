using Core.Modules.ListeningModule.DTOs.Segment;
using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace Core.Modules.ListeningModule.DTOs.Track
{
    public class CreateTrackDto
    {
        [Required(ErrorMessage = "The {0} field is required")]
        [MaxLength(255, ErrorMessage = "The {0} field must not exceed {1} characters.")]
        public string Name { get; set; }

        [Required(ErrorMessage = "The {0} field is required")]
        public string FullTranscript { get; set; }

        [Required(ErrorMessage = "The {0} field is required")]
        public IFormFile FullAudio { get; set; }
        public List<CreateSegmentDto> Segments { get; set; }
    }
}
