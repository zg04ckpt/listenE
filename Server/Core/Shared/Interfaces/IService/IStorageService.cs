using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Shared.Interfaces.IService
{
    public interface IStorageService
    {
        Task<string> GetHtmlTemplate(string templateFileName);
        Task<string?> SaveImage(IFormFile file);
        Task<bool> RemoveImage(string imageUrl);
        Task<string?> SaveAudio(MemoryStream mp3Stream);
    }
}
