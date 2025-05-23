using Core.Shared.DTOs;

namespace Core.Modules.BasicListening.DTOs.Track
{
    public class TrackSearchDto : PagingRequestBaseDTO
    {
        public string? Name { get; set; }
    }
}
