
using Core.Modules.BasicListening.Entities;
using Core.Shared.Exceptions;
using Microsoft.AspNetCore.Http;
using NAudio.Lame;
using NAudio.Wave;
using NLayer.NAudioSupport;

namespace Core.Shared.Utilities
{
    public class AudioHandler : IDisposable
    {
        private string _tempDirPath;
        private string _mp3SourceFilePath;
        private string _wavSourceFilePath;
        private AudioFileReader _audioFileReader;
        private int _bytesPerSec;

        public AudioHandler()
        {
            _tempDirPath = Path.Combine("Resources", "Temp");
            Directory.CreateDirectory(_tempDirPath);
        }

        public async Task InitializeAsync(IFormFile mp3File)
        {
            try
            {
                // Check if this is a valid mp3 file
                if (mp3File.Length == 0)
                {
                    throw new BadRequestException("File is empty.");
                }
                if (mp3File.ContentType != "audio/mpeg")
                {
                    throw new BadRequestException("File is invalid mp3 file.");
                }

                // Save temp file 
                _mp3SourceFilePath = Path.Combine(_tempDirPath, $"{Guid.NewGuid()}.mp3");
                {
                    using var fileStream = File.Create(_mp3SourceFilePath);
                    await mp3File.CopyToAsync(fileStream);
                }

                // Convert to wav file
                _wavSourceFilePath = Path.Combine(_tempDirPath, $"{Guid.NewGuid()}.wav");
                ConvertMp3ToWave(_mp3SourceFilePath, _wavSourceFilePath);

                // Init handler
                _audioFileReader = new AudioFileReader(_wavSourceFilePath);
                _bytesPerSec = _audioFileReader.WaveFormat.AverageBytesPerSecond;
            } 
            catch (Exception ex)
            {
                throw new ServerErrorException("Failed to init AudioHandler:" + ex.Message);
            }
        }

        public async Task InitializeAsync(string mp3FileUrl)
        {
            try
            {
                // Get file from url and save it
                _mp3SourceFilePath = Path.Combine(_tempDirPath, $"{Guid.NewGuid()}.mp3");
                {
                    using var httpClient = new HttpClient();
                    using var fileStream = File.Create(_mp3SourceFilePath);
                    var response = await httpClient.GetAsync(mp3FileUrl, HttpCompletionOption.ResponseHeadersRead);
                    if (response.IsSuccessStatusCode)
                    {
                        using var stream = await response.Content.ReadAsStreamAsync();
                        await stream.CopyToAsync(fileStream);
                    }
                    else
                    {
                        throw new ServerErrorException("Failed to get track audio data from url.");
                    }
                }

                // Convert to wav file
                _wavSourceFilePath = Path.Combine(_tempDirPath, $"{Guid.NewGuid()}.wav");
                ConvertMp3ToWave(_mp3SourceFilePath, _wavSourceFilePath);

                // Init handler
                _audioFileReader = new AudioFileReader(_wavSourceFilePath);
                _bytesPerSec = _audioFileReader.WaveFormat.AverageBytesPerSecond;
            }
            catch (Exception ex)
            {
                throw new ServerErrorException("Failed to init AudioHandler:" + ex.Message);
            }
        }

        public async Task Cut(double startSec, double endSec, MemoryStream outputStream)
        {
            // Check time
            if (startSec >= endSec || endSec > _audioFileReader.TotalTime.TotalSeconds)
            {
                throw new BadRequestException(
                    "End time must greater than start time and cannot exceed total time");
            }

            var wavTempFilePath = Path.Combine(_tempDirPath, $"{Guid.NewGuid()}.wav");
            var mp3TempFilePath = Path.Combine(_tempDirPath, $"{Guid.NewGuid()}.mp3");
            try
            {
                // Calc start / end read position
                var startPos = (long)(startSec * _bytesPerSec);
                startPos = startPos - startPos % _audioFileReader.WaveFormat.BlockAlign;
                var endPos = (long)(endSec * _bytesPerSec);
                endPos = endPos - endPos % _audioFileReader.WaveFormat.BlockAlign;
                _audioFileReader.Position = startPos;

                // Read data to a temp wav file
                var bytesRequired = endPos - startPos;
                var buffer = new byte[1024];
                {
                    using var wavOutputFileStream = File.OpenWrite(wavTempFilePath);
                    using var writer = new WaveFileWriter(wavOutputFileStream, _audioFileReader.WaveFormat);
                    while (bytesRequired > 0)
                    {
                        var bytesToRead = (int)Math.Min(buffer.Length, bytesRequired);
                        var bytesRead = _audioFileReader.Read(buffer, 0, bytesToRead);
                        if (bytesRead == 0)
                            break;
                        writer.Write(buffer, 0, bytesRead);
                        bytesRequired -= bytesRead;
                    }
                    await writer.FlushAsync();
                }

                // Convert wav temp file to mp3 temp file
                ConvertWaveToMp3(wavTempFilePath, mp3TempFilePath);
                {
                    using var mp3OutputStream = File.OpenRead(mp3TempFilePath);
                    await mp3OutputStream.CopyToAsync(outputStream);
                }
            }
            catch (Exception ex)
            {
                throw new ServerErrorException("Failed to init AudioHandler:" + ex.Message);
            }
            finally
            {
                ClearFile(mp3TempFilePath);
                ClearFile(wavTempFilePath);
            }
        }

        public TimeSpan GetTotalTime()
        {
            return _audioFileReader.TotalTime;
        }

        private void ClearFile(string filePath)
        {
            if (File.Exists(filePath))
            {
                File.Delete(filePath);
            }
        }

        public void ClearAll()
        {
            _audioFileReader.Dispose();
            ClearFile(_wavSourceFilePath);
            ClearFile(_mp3SourceFilePath);
        }

        public async Task<MemoryStream> GetSourceMp3FileStream()
        {
            var stream = new MemoryStream();
            using var fileStream = File.OpenRead(_mp3SourceFilePath);
            await fileStream.CopyToAsync(stream);
            return stream;
        }

        private void ConvertMp3ToWave(string mp3FileName, string waveFileName)
        {
            try
            {
                var builder = new Mp3FileReaderBase.FrameDecompressorBuilder(wf => new Mp3FrameDecompressor(wf));
                using var reader = new Mp3FileReaderBase(mp3FileName, builder);
                using var writer = new WaveFileWriter(waveFileName, reader.WaveFormat);
                reader.CopyTo(writer);
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException($"Failed to convert MP3 to WAV: {ex.Message}", ex);
            }
        }

        private void ConvertWaveToMp3(string waveFileName, string mp3FileName, int bitRate = 128)
        {
            try
            {
                using var reader = new AudioFileReader(waveFileName);
                using var writer = new LameMP3FileWriter(mp3FileName, reader.WaveFormat, bitRate);
                reader.CopyTo(writer);
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException($"Failed to convert WAV to MP3: {ex.Message}", ex);
            }
        }

        public void Dispose()
        {
            ClearAll();
        }

        ~AudioHandler()
        {
            ClearAll();
        }
    }
}
