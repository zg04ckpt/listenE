using Core.Modules.BasicListening.DTOs.Segment;
using Core.Modules.BasicListening.Entities;
using Core.Modules.BasicListening.Interfaces;
using Core.Shared.Exceptions;
using Core.Shared.Interfaces.IRepository;
using Core.Shared.Utilities;
using Core.Shared.Wrappers;
using System.Text.RegularExpressions;

namespace Core.Modules.BasicListening.Services
{
    public class SegmentService : ISegmentService
    {
        private readonly IBaseRepository<Segment> _segmentRepository;

        public SegmentService(IBaseRepository<Segment> segmentRepository)
        {
            _segmentRepository = segmentRepository;
        }

        public async Task<ApiResult<CheckSegmentResultDto>> CheckSegment(int segmentId, CheckSegmentDto request)
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
                }
                else
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
    }
}
