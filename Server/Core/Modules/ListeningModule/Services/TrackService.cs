using Core.Modules.ListeningModule.DTOs.Segment;
using Core.Modules.ListeningModule.DTOs.Track;
using Core.Modules.ListeningModule.Entities;
using Core.Modules.ListeningModule.Interfaces;
using Core.Shared.DTOs;
using Core.Shared.Exceptions;
using Core.Shared.Interfaces.IRepository;
using Core.Shared.Interfaces.IService;
using Core.Shared.Utilities;
using Core.Shared.Wrappers;
using NAudio.Wave;
using System;
using System.Diagnostics;
using System.Text.RegularExpressions;

namespace Core.Modules.ListeningModule.Services
{
    public class TrackService : ITrackService
    {
        private readonly IBaseRepository<Track> _trackRepository;
        private readonly IBaseRepository<Session> _sessionRepository;
        private readonly IBaseRepository<Segment> _segmentRepository;
        private readonly IStorageService _storageService;
        private readonly IAudioConvertService _audioConvertService;

        public TrackService(
            IBaseRepository<Track> trackRepository,
            IBaseRepository<Session> sessionRepository,
            IStorageService storageService,
            IBaseRepository<Segment> segmentRepository,
            IAudioConvertService audioConvertService)
        {
            _trackRepository = trackRepository;
            _sessionRepository = sessionRepository;
            _storageService = storageService;
            _segmentRepository = segmentRepository;
            _audioConvertService = audioConvertService;
        }
        public async Task<ApiResult<CheckSegmentResultDto>> CheckSegment(int segmentId, CheckSegmentCorrectDto request)
        {
            var segment = await _segmentRepository.FindAsync(e => e.Id == segmentId)
                ?? throw new NotFoundException(
                    "Segment does not exist.",
                    ApiHelper.ErrorCodes.RESOURCE_NOT_FOUND);

            // Replace all contraction word state to full word state
            var userInput = StringHelper.ExpandContractions(request.Content);
            var correct = StringHelper.ExpandContractions(segment.Transcript);

            // Clean input
            userInput = Regex.Replace(userInput, @"[^\w\s]", "");
            correct = Regex.Replace(correct, @"[^\w\s]", "");

            // Get words
            var typedWords = userInput.Trim().Split(" ")
                .Where(e => !string.IsNullOrEmpty(e))
                .Select(e => e.ToLower())
                .ToArray();
            var correctWords = correct.Trim().Split(" ")
                .Where(e => !string.IsNullOrEmpty(e))
                .Select(e => e.ToLower())
                .ToArray();

            // Use LCS algorithm find the lcs words
            var lcs = AlgorithmHelper.GetLCS(typedWords, correctWords);

            // Checking
            var index = 0;
            var checkedWords = new List<WordCorrectListItem>();
            foreach (var word in correctWords)
            {
                if (index < lcs.Count && word == lcs[index])
                {
                    checkedWords.Add(new()
                    {
                        Word = word,
                        ResultType = Enums.WordCheckResultType.Correct,
                        Order = checkedWords.Count + 1
                    });
                    index++;
                } else
                {
                    checkedWords.Add(new()
                    {
                        Word = word,
                        ResultType = Enums.WordCheckResultType.MissingOrWrong,
                        Order = checkedWords.Count + 1
                    });
                }
            }

            // Calc result
            var result = new CheckSegmentResultDto()
            {
                SegmentId = segment.Id,
                CheckedWords = checkedWords,
                CorrectRate = Math.Round((double)index / checkedWords.Count * 100f, 2),
                CorrectTranscript = segment.Transcript,
                Redundancy = typedWords.Length - correctWords.Length,
            };
            if (result.Redundancy < 0)
            {
                result.Redundancy = 0;
            }
            result.RedundancyRate = Math.Round((double)result.Redundancy / typedWords.Length * 100f, 2);
            result.Score = (int)Math.Floor(result.CorrectRate - result.RedundancyRate);
            if (result.Score < 0)
            {
                result.Score = 0;
            }

            return new ApiResult<CheckSegmentResultDto>
            {
                Data = result
            };
        }

        public async Task<ApiResult<TrackDto>> CreateNewTrackInSession(int sessionId, CreateTrackDto request)
        {
            // Check if session valid
            if (!await _sessionRepository.ExistsAsync(e => e.Id == sessionId))
            {
                throw new NotFoundException(
                    "Session does not exists.",
                    ApiHelper.ErrorCodes.RESOURCE_NOT_FOUND);
            }

            // Check if track name already existed in session
            if (await _trackRepository.ExistsAsync(
                e => e.Name == request.Name &&
                e.SessionId == sessionId))
            {
                throw new ConflictException(
                    "Track name already exists in session.",
                    ApiHelper.ErrorCodes.ALREADY_EXISTS);
            }

            // At least 1 segment exists
            if (request.Segments.Count == 0)
            {
                throw new BadRequestException(
                    "The segment array must contain at least one element.");
            }

            // Save audio file in memory stream
            using var trackStream = new MemoryStream();
            await request.FullAudio.CopyToAsync(trackStream);

            // Start read from first byte
            trackStream.Position = 0;

            // Convert MP3 => WAV
            var wavStream = new MemoryStream();
            await _audioConvertService.ConvertFromMP3ToWAV(trackStream, wavStream);

            // Read audio from memory stream
            wavStream.Position = 0;
            using var reader = new WaveFileReader(wavStream);
            var sampleRate = reader.WaveFormat.SampleRate;
            var bytesPerSample = reader.WaveFormat.BitsPerSample / 8 * reader.WaveFormat.Channels;

            // Split with segment
            var newSegments = new List<Segment>();
            foreach (var seg in request.Segments)
            {
                // Check time
                if (seg.StartSec >= seg.EndSec || seg.EndSec > reader.TotalTime.TotalSeconds)
                {
                    throw new BadRequestException(
                        "End time must greater than start time and cannot exceed total time");
                }

                // Calculate read pos
                long startPos = (long) seg.StartSec * sampleRate * bytesPerSample;
                long bytesToRead = (long) (seg.EndSec - seg.StartSec) * sampleRate * bytesPerSample;

                reader.Position = startPos;
                byte[] buffer = new byte[bytesToRead];
                int bytesRead = reader.Read(buffer, 0, (int)bytesToRead);

                if (bytesRead < bytesToRead)
                {
                    Array.Resize(ref buffer, bytesRead);
                }

                // write to wav file
                using var segStream = new MemoryStream();
                using var writer = new WaveFileWriter(segStream, reader.WaveFormat);
                writer.Write(buffer, 0, bytesRead);
                segStream.Position = 0;

                // Create upload stream
                using var uploadStream = new MemoryStream();
                await segStream.CopyToAsync(uploadStream);
                uploadStream.Position = 0;

                // Upload lên Cloudinary & save segment info
                newSegments.Add(new()
                {
                    Duration = writer.TotalTime,
                    AudioUrl = await _storageService.SaveAudio(uploadStream)
                        ?? throw new ServerErrorException("Failed to upload segment audio file."),
                    CreatedAt = DateTime.UtcNow,
                    OrderInTrack = seg.Order,
                    Transcript = seg.Transcript,
                    UpdatedAt = DateTime.UtcNow,
                });

                //uploadStream.Dispose();
            }

            // Create track
            trackStream.Position = 0;
            var track = new Track
            {
                Name = request.Name,
                FullAudioUrl = await _storageService.SaveAudio(trackStream)
                    ?? throw new ServerErrorException("Failed to upload full track audio file."),
                FullAudioTranscript = request.FullTranscript,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                FullAudioDuration = reader.TotalTime,
                OrderInSession = (await _trackRepository.CountAsync(e => e.SessionId == sessionId)) + 1,
                SessionId = sessionId
            };
            await _trackRepository.AddAsync(track);
            await _trackRepository.SaveToDatabaseAsync();

            // Save segments
            newSegments.ForEach(e => e.TrackId = track.Id);
            await _segmentRepository.AddRangeAsync(newSegments);
            await _trackRepository.SaveToDatabaseAsync();

            return new ApiResult<TrackDto>
            {
                Message = "Create track successfully.",
                Data = new TrackDto
                {
                    Id = track.Id,
                    CreatedAt = track.CreatedAt,
                    FullAudioDuration = track.FullAudioDuration,
                    FullAudioUrl = track.FullAudioUrl,
                    FullAudioTranscript = track.FullAudioTranscript,
                    Name = track.Name,
                    SegmentCount = newSegments.Count,
                    OrderInSession = track.OrderInSession,
                    SessionId = sessionId,
                    UpdatedAt = track.UpdatedAt,
                }
            };
        }

        public async Task<ApiResult<DeleteResponseDto>> DeleteTrack(int trackId)
        {
            // Find and remove track
            var track = await _trackRepository.FindAsync(e => e.Id == trackId)
                ?? throw new NotFoundException(
                    "Track does not exist.",
                    ApiHelper.ErrorCodes.RESOURCE_NOT_FOUND);
            await _trackRepository.DeleteAsync(track);
            await _trackRepository.SaveToDatabaseAsync();

            // Update remaining track order
            var remainingTracks = (await _trackRepository.GetAllAsync(
                e => e.SessionId == track.SessionId,
                sortBy: e => e.OrderInSession)).ToArray();
            for (int i = 0; i < remainingTracks.Length; i++)
            {
                await _trackRepository.UpdateAsync(
                    remainingTracks[i], 
                    e => e.OrderInSession = i + 1);
            }
            await _trackRepository.SaveToDatabaseAsync();

            return new ApiResult<DeleteResponseDto>
            {
                Message = "Delete successfully.",
                Data = new DeleteResponseDto
                {
                    Id = track.Id,
                }
            };
        }

        public async Task<ApiResult<TrackContentDto>> GetTrackContent(int trackId)
        {
            return new ApiResult<TrackContentDto>
            {
                Data = await _trackRepository.FindAsync(
                    e => e.Id == trackId,
                    e => new TrackContentDto
                    {
                        Id = e.Id,
                        Name = e.Name,
                        FullAudioUrl = e.FullAudioUrl,
                        FullAudioTranscript = e.FullAudioTranscript,
                        FullAudioDuration = e.FullAudioDuration,
                        Segments = e.Segments.Select(e => new SegmentInTrackDto
                        {
                            Id = e.Id,
                            AudioUrl = e.AudioUrl,
                            Transcript = e.Transcript,
                            OrderInTrack = e.OrderInTrack,
                            SegmentDuration = e.Duration,
                        }).ToList()
                    })
                    ?? throw new NotFoundException(
                        "Track does not exist.",
                        ApiHelper.ErrorCodes.RESOURCE_NOT_FOUND)
            };
        }

        public async Task<ApiResult<TrackListItemDto[]>> GetTracksOfSession(int sessionId)
        {
            return new ApiResult<TrackListItemDto[]>
            {
                Data = (await _trackRepository.GetAllAsync(
                    e => e.SessionId == sessionId,
                    e => new TrackListItemDto
                    {
                        Id = e.Id,
                        Name = e.Name,
                        OrderInSession = e.OrderInSession
                    })).ToArray()
            };
        }

        public Task<ApiResult<UpdateResponseDto>> UpdateTrack(int trackId, CreateTrackDto track)
        {
            throw new NotImplementedException();
        }
    }
}
