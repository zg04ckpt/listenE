using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Modules.ListeningModule.Interfaces
{
    public interface IAudioConvertService
    {
        Task ConvertFromMP3ToWAV(MemoryStream mp3InputStream, MemoryStream wavOutputStream);
    }
}
