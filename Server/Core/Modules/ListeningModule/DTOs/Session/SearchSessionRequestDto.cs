using Core.Shared.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Modules.ListeningModule.DTOs.Session
{
    public class SearchSessionRequestDto : PagingRequestBaseDTO
    {
        public string? Key { get; set; }
        public int? TopicId { get; set; }
    }
}
