using Core.Modules.ListeningModule.Interfaces;
using Core.Shared.Configurations;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xabe.FFmpeg;

namespace Core.Modules.ListeningModule.Services
{
    public class AudioConvertService : IAudioConvertService
    {
        private readonly CommonConfig _commonConfig;

        public AudioConvertService(IOptions<CommonConfig> options)
        {
            _commonConfig = options.Value;
            if (!string.IsNullOrEmpty(_commonConfig.FFmpegPath))
            {
                FFmpeg.SetExecutablesPath(_commonConfig.FFmpegPath);
            }
        }

        public async Task ConvertFromMP3ToWAV(MemoryStream mp3InputStream, MemoryStream wavOutputStream)
        {
            if (mp3InputStream == null || mp3InputStream.Length == 0)
                throw new ArgumentException("Stream đầu vào rỗng hoặc null.");

            string tempInputPath = Path.Combine(_commonConfig.TempFilesPath, $"{Guid.NewGuid()}.mp3");
            string tempOutputPath = Path.Combine(_commonConfig.TempFilesPath, $"{Guid.NewGuid()}.wav");

            try
            {
                mp3InputStream.Position = 0;
                Directory.CreateDirectory(Path.GetDirectoryName(tempInputPath));

                using (var tempInputFile = File.Create(tempInputPath))
                {
                    await mp3InputStream.CopyToAsync(tempInputFile);
                    await tempInputFile.FlushAsync();
                }

                FileInfo mp3FileInfo = new FileInfo(tempInputPath);
                if (!mp3FileInfo.Exists || mp3FileInfo.Length == 0)
                    throw new Exception($"File MP3 tạm không tồn tại hoặc rỗng: {tempInputPath}");

                Console.WriteLine($"MP3 tạm: {tempInputPath}, Kích thước: {mp3FileInfo.Length} bytes");

                // Tạo lệnh FFmpeg không dùng -_combined
                IConversion conversion = FFmpeg.Conversions.New()
                    .AddParameter($"-i \"{tempInputPath}\" -f wav \"{tempOutputPath}\"");
                Console.WriteLine($"Lệnh FFmpeg: {conversion.Build()}");
                conversion.OnDataReceived += (sender, args) => Console.WriteLine($"FFmpeg Output: {args.Data}");
                await conversion.Start();

                if (!File.Exists(tempOutputPath))
                    throw new Exception($"File WAV không được tạo: {tempOutputPath}");
                Console.WriteLine($"WAV tạm: {tempOutputPath}, Kích thước: {new FileInfo(tempOutputPath).Length} bytes");

                using (var tempOutputFile = File.OpenRead(tempOutputPath))
                {
                    await tempOutputFile.CopyToAsync(wavOutputStream);
                }
                wavOutputStream.Position = 0;
            }
            catch (Exception ex)
            {
                throw new Exception($"Chuyển đổi MP3 sang WAV thất bại: {ex.Message}", ex);
            }
            finally
            {
                if (File.Exists(tempInputPath)) File.Delete(tempInputPath);
                if (File.Exists(tempOutputPath)) File.Delete(tempOutputPath);
            }
        }
    }
}
