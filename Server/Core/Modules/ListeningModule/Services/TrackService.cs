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
using Org.BouncyCastle.Crypto.IO;
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

        public TrackService(
            IBaseRepository<Track> trackRepository,
            IBaseRepository<Session> sessionRepository,
            IStorageService storageService,
            IBaseRepository<Segment> segmentRepository)
        {
            _trackRepository = trackRepository;
            _sessionRepository = sessionRepository;
            _storageService = storageService;
            _segmentRepository = segmentRepository;
        }

        
        public async Task<ApiResult<TrackCreateResponseDto>> CreateNewTrackInSession(int sessionId, CreateTrackDto request)
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

            // At least 1 seg exists
            if (request.Segments.Count == 0)
            {
                throw new BadRequestException(
                    "The seg array must contain at least one element.");
            }

            var audioHandler = new AudioHandler();
            await audioHandler.InitializeAsync(request.FullAudio);

            // Split stream for each segment
            var newSegments = new List<Segment>();
            foreach (var seg in request.Segments)
            {
                using var resultStream = new MemoryStream();
                await audioHandler.Cut(seg.StartSec, seg.EndSec, resultStream);
                newSegments.Add(new()
                {
                    StartSec = seg.StartSec,
                    EndSec = seg.EndSec,
                    AudioUrl = await _storageService.SaveAudio(resultStream)
                        ?? throw new ServerErrorException("Failed to upload segment audio file."),
                    CreatedAt = DateTime.UtcNow,
                    OrderInTrack = seg.Order,
                    Transcript = seg.Transcript,
                    UpdatedAt = DateTime.UtcNow,
                });
            }

            var track = new Track
            {
                Name = request.Name,
                FullAudioUrl = await _storageService.SaveAudio(
                    await audioHandler.GetSourceMp3FileStream())
                    ?? throw new ServerErrorException("Failed to upload full track audio file."),
                FullAudioTranscript = request.FullTranscript,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                FullAudioDuration = audioHandler.GetTotalTime(),
                OrderInSession = (await _trackRepository.CountAsync(e => e.SessionId == sessionId)) + 1,
                SessionId = sessionId
            };
            await _trackRepository.AddAsync(track);
            await _trackRepository.SaveToDatabaseAsync();

            // Save segments
            newSegments.ForEach(e => e.TrackId = track.Id);
            await _segmentRepository.AddRangeAsync(newSegments);
            await _trackRepository.SaveToDatabaseAsync();
            audioHandler.ClearAll();

            return new ApiResult<TrackCreateResponseDto>
            {
                Message = "Create track successfully.",
                Data = new TrackCreateResponseDto
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
            // Find target track and all child seg
            var track = await _trackRepository.FindAsync(e => e.Id == trackId)
                ?? throw new NotFoundException(
                    "Track does not exist.",
                    ApiHelper.ErrorCodes.RESOURCE_NOT_FOUND);
            var segmentAudioUrls = await _segmentRepository.GetAllAsync(
                e => e.TrackId == trackId,
                e => e.AudioUrl);


            // Remove all data in cloud
            bool issuccess = await _storageService.RemoveAudio(track.FullAudioUrl);
            foreach (var url in segmentAudioUrls)
            {
                await _storageService.RemoveAudio(url);
            }


            // Update remaining track order
            var remainingTracks = (await _trackRepository.GetAllAsync(
                e => e.SessionId == track.SessionId && e.OrderInSession > track.OrderInSession));
            foreach (var t in remainingTracks)
            {
                await _trackRepository.UpdateAsync(
                    t, 
                    e => e.OrderInSession = e.OrderInSession - 1);
            }

            await _trackRepository.DeleteAsync(track);
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

        public async Task<ApiResult<TrackDto>> GetTrackContent(int trackId)
        {
            return new ApiResult<TrackDto>
            {
                Data = await _trackRepository.FindAsync(
                    e => e.Id == trackId,
                    e => new TrackDto
                    {
                        Id = e.Id,
                        Name = e.Name,
                        FullAudioUrl = e.FullAudioUrl,
                        FullAudioTranscript = e.FullAudioTranscript,
                        FullAudioDuration = e.FullAudioDuration,
                        Segments = e.Segments.Select(s => new SegmentDto
                        {
                            Id = s.Id,
                            AudioUrl = s.AudioUrl,
                            Transcript = s.Transcript,
                            OrderInTrack = s.OrderInTrack,
                            SegmentDuration = TimeSpan.FromSeconds(s.EndSec - s.StartSec),
                            StartSec = s.StartSec,
                            EndSec = s.EndSec,
                            UpdatedAt = s.UpdatedAt,
                            CreatedAt = s.CreatedAt,
                        }).ToList(),
                        UpdatedAt = e.UpdatedAt,
                        CreatedAt = e.CreatedAt,
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

        public async Task<ApiResult<UpdateResponseDto>> UpdateTrack(int trackId, UpdateTrackDto request)
        {
            // Checking
            if (request.Segments.Count == 0)
            {
                throw new BadRequestException(
                    "The seg array must contain at least one element.");
            }

            // Update track info
            var track = await _trackRepository.FindAsync(e => e.Id == trackId)
                ?? throw new NotFoundException(
                    "Track does not exist.",
                    ApiHelper.ErrorCodes.RESOURCE_NOT_FOUND);
            track.Name = request.Name;
            track.FullAudioTranscript = request.FullTranscript;
            track.UpdatedAt = DateTime.UtcNow;

            // Prepare for update segment
            var segments = await _segmentRepository.GetAllAsync(e => e.TrackId == trackId);
            var updatedSegments = request.Segments
                .Where(e => e.Id != null)
                .ToDictionary(e => e.Id!.Value);
            using var audioHandler = new AudioHandler();
            await audioHandler.InitializeAsync(track.FullAudioUrl);

            // Update existed segment in track (reinit audio file or remove segment as needed)
            foreach (var seg in segments)
            {
                // Update when found
                if (updatedSegments.TryGetValue(seg.Id, out var updatedSegment))
                {
                    // Update audio when time line change
                    string? newAudioUrl = null;
                    if (updatedSegment.StartSec != seg.StartSec || updatedSegment.EndSec != seg.EndSec)
                    {
                        using var newAudioStream = new MemoryStream();
                        await audioHandler.Cut(
                                (double)updatedSegment.StartSec,
                                (double)updatedSegment.EndSec, newAudioStream);
                        await _storageService.RemoveAudio(seg.AudioUrl);
                        newAudioUrl = await _storageService.SaveAudio(newAudioStream)
                            ?? throw new ServerErrorException("Failed to upload segment audio file.");
                    }
                    await _segmentRepository.UpdateAsync(seg, seg =>
                    {
                        seg.UpdatedAt = DateTime.UtcNow;
                        seg.Transcript = updatedSegment.Transcript;
                        seg.OrderInTrack = updatedSegment.OrderInTrack;
                        seg.AudioUrl = newAudioUrl ?? seg.AudioUrl;
                        seg.StartSec = updatedSegment.StartSec;
                        seg.EndSec = updatedSegment.EndSec;
                    });
                }
                // Delete when not found
                else
                {
                    await _storageService.RemoveAudio(seg.AudioUrl);
                    await _segmentRepository.DeleteAsync(seg);
                }
            }

            // Create new segment if it's id is null
            var newSegments = new List<Segment>();
            foreach (var seg in request.Segments.Where(e => e.Id is null))
            {
                using var resultStream = new MemoryStream();
                await audioHandler.Cut((double)seg.StartSec,(double)seg.EndSec, resultStream);
                newSegments.Add(new()
                {
                    StartSec = seg.StartSec,
                    EndSec = seg.EndSec,
                    AudioUrl = await _storageService.SaveAudio(resultStream)
                        ?? throw new ServerErrorException("Failed to upload segment audio file."),
                    CreatedAt = DateTime.UtcNow,
                    OrderInTrack = seg.OrderInTrack,
                    Transcript = seg.Transcript,
                    UpdatedAt = DateTime.UtcNow,
                    TrackId = track.Id,
                });
            }
            await _segmentRepository.AddRangeAsync(newSegments);

            // Complete
            audioHandler.ClearAll();
            await _trackRepository.SaveToDatabaseAsync();
            return new ApiResult<UpdateResponseDto>
            {
                Message = "Update track successfully.",
                Data = new UpdateResponseDto
                {
                    Id = track.Id,
                }
            };
        }
    }
}
