using Core.Modules.Auth.Entities;
using Core.Modules.ToeicPractice.DTOs;
using Core.Modules.ToeicPractice.DTOs.Part1;
using Core.Modules.ToeicPractice.DTOs.Part2;
using Core.Modules.ToeicPractice.DTOs.Part34;
using Core.Modules.ToeicPractice.Entities;
using Core.Modules.ToeicPractice.Enums;
using Core.Modules.ToeicPractice.Interfaces.IRepository;
using Core.Modules.ToeicPractice.Interfaces.IService;
using Core.Modules.ToeicPracticeModule.Entities;
using Core.Shared.DTOs;
using Core.Shared.Entities;
using Core.Shared.Exceptions;
using Core.Shared.Interfaces.IRepository;
using Core.Shared.Interfaces.IService;
using Core.Shared.Utilities;
using Core.Shared.Wrappers;
using System.Security.Claims;

namespace Core.Modules.ToeicPractice.Services
{
    public class ToeicQuestionService : IToeicQuestionService
    {
        private readonly IStorageService _storageService;
        private readonly IBaseRepository<ToeicQuestion> _questionRepository;
        private readonly IBaseRepository<ToeicAnswer> _answerRepository;
        private readonly IBaseRepository<ToeicQuestionTag> _tagRepository;
        private readonly IQuestionGroupRepository _groupRepository;
        private readonly IBaseRepository<Topic> _topicRepository;
        private readonly IBaseRepository<User> _userRepository;
        private readonly IBaseRepository<CompletedQuestion> _completedQuesRepository;

        public ToeicQuestionService(
            IStorageService storageService,
            IBaseRepository<ToeicQuestion> questionRepository,
            IBaseRepository<ToeicAnswer> answerRepository,
            IBaseRepository<ToeicQuestionTag> tagRepository,
            IBaseRepository<Topic> topicRepository,
            IQuestionGroupRepository groupRepository,
            IBaseRepository<User> userRepository,
            IBaseRepository<CompletedQuestion> completedQuesRepository)
        {
            _storageService = storageService;
            _questionRepository = questionRepository;
            _answerRepository = answerRepository;
            _tagRepository = tagRepository;
            _topicRepository = topicRepository;
            _groupRepository = groupRepository;
            _userRepository = userRepository;
            _completedQuesRepository = completedQuesRepository;
        }

        public async Task<ApiResult<QuestionKeyDto>> GetQuestionCorrectAnswerAsync(int questionId, ClaimsPrincipal claims)
        {
            var key = await _questionRepository.FindAsync(
                predicate: e => e.Id == questionId &&
                    (e.Tag.Type == ToeicPartType.Part1 || e.Tag.Type == ToeicPartType.Part2),
                projection: e => new QuestionKeyDto()
                {
                    CorrectKey = e.CorrectAnswerKey,
                    Explanation = e.Explanation,
                    Transcript = e.Transcript!,
                    AnswerKeys = e.Answers.Select(a => new QuestionAnswerKeysDto
                    {
                        Content = a.Content,
                        Key = a.Key
                    }).ToArray()
                })
                ?? throw new NotFoundException(
                    "Question does not exist",
                    ApiHelper.ErrorCodes.RESOURCE_NOT_FOUND);

            // Mark completed
            var userId = Helper.GetUserIdFromClaims(claims);
            if (
                userId != null && 
                await _userRepository.ExistsAsync(e => e.Id == userId) &&
                !await _completedQuesRepository.ExistsAsync(e => 
                    e.UserId == userId && e.QuestionId == questionId))
            {
                await _completedQuesRepository.AddAsync(new CompletedQuestion
                {
                    UserId = userId.Value,
                    QuestionId = questionId,
                });
                await _completedQuesRepository.SaveToDatabaseAsync();
            }

            return new ApiResult<QuestionKeyDto>
            {
                Data = key
            };
        }

        public async Task<ApiResult<UpdateResponseDto>> UpdatePart1Question(int id, CreateOrUpdatePart1QuestionDto data)
        {
            var question = await _questionRepository.FindAsync(
                e => e.Id == id)
                ?? throw new NotFoundException(
                    "Lesson does not exists",
                    ApiHelper.ErrorCodes.RESOURCE_NOT_FOUND);

            if (
                data.TagId != question.TagId &&
                !await _tagRepository.ExistsAsync(e => e.Id == data.TagId && e.Type == ToeicPartType.Part3))
            {
                throw new BadRequestException(
                    "Tag does not exist or not belong to part 3.",
                    ApiHelper.ErrorCodes.RESOURCE_NOT_FOUND);
            }

            // Update question
            if (data.Image != null)
            {
                await _storageService.RemoveImage(question.ImageUrl!);
                question.ImageUrl = await _storageService.SaveImage(data.Image);
            }
            if (data.Audio != null)
            {
                using var audioStream = new MemoryStream();
                await data.Audio.CopyToAsync(audioStream);
                await _storageService.RemoveAudio(question.AudioUrl!);
                question.AudioUrl = await _storageService.SaveAudio(audioStream);
            }
            question.CorrectAnswerKey = data.CorrectAnswer;
            question.Transcript = data.Transcript;
            question.Explanation = data.Explanation;
            question.UpdatedAt = DateTime.UtcNow;
            question.TagId = data.TagId;

            await _questionRepository.UpdateAsync(question);

            // Update answer
            var answers = await _answerRepository.GetAllAsync(
                e => e.QuestionId == question.Id,
                sortBy: e => e.Key,
                isAsc: true);
            for (int i = 0; i < 4; i++)
            {
                await _answerRepository.UpdateAsync(
                    answers.ElementAt(i),
                    a => a.Content = data.Answers[i].Content);
            }

            await _questionRepository.SaveToDatabaseAsync();

            return new ApiResult<UpdateResponseDto>
            {
                Message = "Update question successfully",
                Data = new UpdateResponseDto
                {
                    Id = question.Id,
                    UpdatedAt = question.UpdatedAt,
                }
            };
        }

        public async Task<ApiResult<Paginated<QuestionListItemDto>>> GetQuestionsAsync(QuestionSearchDto data, ClaimsPrincipal claims)
        {
            var predicateBuilder = new PredicateBuilder<ToeicQuestion>();
            if (data.TagId != null)
            {
                predicateBuilder.AndCondition(e => e.TagId == data.TagId);
            }

            if (data.Type != null)
            {
                if (data.Type == ToeicPartType.Part3 || data.Type == ToeicPartType.Part4)
                    throw new BadRequestException(
                        "Part 3, 4 questions must get with grouping.");
                predicateBuilder.AndCondition(e => e.Tag.Type == data.Type);
            } 
            else
            {
                predicateBuilder.AndCondition(e => 
                    e.Tag.Type == ToeicPartType.Part1 || e.Tag.Type == ToeicPartType.Part2);
            }

            var questions = await _questionRepository.GetPaginatedAsync(
                predicate: predicateBuilder.GetPredicateOrDefault(),
                page: data.Page,
                size: data.Size,
                sortBy: e => e.CreatedAt,
                isAsc: false,
                projection: e => new QuestionListItemDto
                {
                    Id = e.Id,
                    TagId = e.TagId,
                    Name = "Question " + e.Id,
                    TagName = e.Tag.Name,
                    Type = e.Tag.Type,
                    CreatedAt = e.CreatedAt,
                    UpdatedAt = e.UpdatedAt,
                });

            // Check complete
            var userId = Helper.GetUserIdFromClaims(claims);
            if (userId != null)
            {
                var completeQuestionIds = (await _userRepository
                    .FindAsync(
                        predicate: e => e.Id == userId,
                        projection: e => e.CompletedQuestions
                            .Select(cq => cq.QuestionId))
                    )!.ToHashSet();
                foreach (var item in questions.Items)
                {
                    item.IsCompleted = completeQuestionIds.Contains(item.Id);
                }
            }

            return new ApiResult<Paginated<QuestionListItemDto>>
            {
                Data = questions
            };
        }

        public async Task<ApiResult<Part1QuestionDto>> CreateNewPart1Question(CreateOrUpdatePart1QuestionDto data)
        {
            if (data.Image == null)
            {
                throw new BadRequestException($"Image cannot be null");
            }

            if (data.Audio == null)
            {
                throw new BadRequestException($"Audio cannot be null");
            }

            if (data.Answers.Count != 4)
            {
                throw new BadRequestException($"Number of answers must be 4, but found {data.Answers.Count}");
            }

            var tag = await _tagRepository.FindAsync(e => 
                e.Id == data.TagId && e.Type == ToeicPartType.Part1)
                ?? throw new BadRequestException(
                    "Tag does not exist or not belong to part 1.",
                    ApiHelper.ErrorCodes.RESOURCE_NOT_FOUND);

            // Create question
            using var audioStream = new MemoryStream();
            await data.Audio.CopyToAsync(audioStream);
            var question = new ToeicQuestion
            {
                AudioUrl = await _storageService.SaveAudio(audioStream)
                    ?? throw new ServerErrorException("Failed to upload question audio file."),
                ImageUrl = await _storageService.SaveImage(data.Image)
                    ?? throw new ServerErrorException("Failed to upload question image file."),
                Explanation = data.Explanation,
                Transcript = data.Transcript,
                CorrectAnswerKey = data.CorrectAnswer,
                Tag = tag,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
            };
            await _questionRepository.AddAsync(question);

            // Create answer
            var answers = new List<ToeicAnswer>();
            for (int i = 0; i < data.Answers.Count; i++)
            {
                answers.Add(new ToeicAnswer
                {
                    Content = data.Answers[i].Content,
                    Key = i + 1,
                    Question = question
                });
            }
            await _answerRepository.AddRangeAsync(answers);
            await _answerRepository.SaveToDatabaseAsync();

            return new ApiResult<Part1QuestionDto>
            {
                Data = new()
                {
                    Id = question.Id,
                    AudioUrl = question.AudioUrl,
                    ImageUrl = question.ImageUrl,
                    Answers = question.Answers.Select((e, i) => new ToeicAnswerDto
                    {
                        Content = $"{(char)('A' + i)}. {e.Content}",
                        Key = e.Key,
                    }).ToArray(),
                    TagId = tag.Id,
                    Type = question.Tag.Type,
                    TagName = tag.Name,
                    CreatedAt = question.CreatedAt,
                    UpdatedAt = question.UpdatedAt,
                },
                Message = "Create question successfully"
            };
        }

        public async Task<ApiResult<Part1QuestionDto>> GetPart1Question(int questionId)
        {
            var question = await _questionRepository.FindAsync(
                predicate: e => e.Id == questionId && e.Tag.Type == ToeicPartType.Part1,
                projection: q => new Part1QuestionDto
                {
                    Id = q.Id,
                    AudioUrl = q.AudioUrl!,
                    ImageUrl = q.ImageUrl!,
                    Name = "Question " + q.Id,
                    Answers = q.Answers.Select(e => new ToeicAnswerDto
                    {
                        Content = e.Content,
                        Key = e.Key,
                    }).ToArray(),
                    TagId = q.Tag.Id,
                    TagName = q.Tag.Name,
                    Type = q.Tag.Type,
                    CreatedAt = q.CreatedAt,
                    UpdatedAt = q.UpdatedAt,
                }) ?? throw new NotFoundException(
                    "Question does not exist.",
                    ApiHelper.ErrorCodes.RESOURCE_NOT_FOUND);

            //for (int i = 0; i < question.Answers.Length; i++)
            //{
            //    question.Answers[i].Content = $"{(char)('A' + i)}.";
            //}

            return new ApiResult<Part1QuestionDto>
            {
                Data = question
            };
        }

        public async Task<ApiResult<DeleteResponseDto>> DeleteQuestion(int questionId)
        {
            var question = await _questionRepository.FindAsync(
                predicate: e => e.Id == questionId && 
                e.Tag.Type == ToeicPartType.Part1) 
                ?? throw new NotFoundException(
                    "Question does not exist.",
                    ApiHelper.ErrorCodes.RESOURCE_NOT_FOUND);
            if (question.ImageUrl != null)
            {
                await _storageService.RemoveImage(question.ImageUrl);
            }
            if (question.AudioUrl != null)
            {
                await _storageService.RemoveAudio(question.AudioUrl);
            }

            await _questionRepository.DeleteAsync(question);
            await _questionRepository.SaveToDatabaseAsync();

            return new ApiResult<DeleteResponseDto>
            {
                Message = "Delete question successfully",
                Data = new DeleteResponseDto { Id = questionId }
            };
        }

        public async Task<ApiResult<QuestionGroupKeyDto>> GetPart34QuestionGroupAnswerKeysAsync(int groupId, ClaimsPrincipal claims)
        {
            var groupKey = await _groupRepository.FindAsync(
                predicate: e => e.Id == groupId,
                projection: e => new QuestionGroupKeyDto
                {
                    GroupId = e.Id,
                    QuestionKeys = e.Questions.Select(q => new QuestionGroupKeyItemDto()
                    {
                        QuestionId = q.Id,
                        Explanation = q.Explanation,
                        CorrectKey = q.CorrectAnswerKey
                    }).ToArray(),
                    Transcript = e.Transcript
                })
                ?? throw new NotFoundException(
                    "Group does not exist",
                    ApiHelper.ErrorCodes.RESOURCE_NOT_FOUND);

            // Mark
            var userId = Helper.GetUserIdFromClaims(claims);
            if (userId != null && await _userRepository.ExistsAsync(e => e.Id == userId))
            {
                await _completedQuesRepository.AddRangeAsync(groupKey.QuestionKeys.Select(q => new CompletedQuestion
                {
                    UserId = userId.Value,
                    QuestionId = q.QuestionId,
                }));
                await _completedQuesRepository.SaveToDatabaseAsync();
            }

            return new ApiResult<QuestionGroupKeyDto>
            {
                Data = groupKey
            };
        }

        public async Task<ApiResult<Part2QuestionDto>> GetPart2Question(int questionId)
        {
            var question = await _questionRepository.FindAsync(
                predicate: e => e.Id == questionId && e.Tag.Type == ToeicPartType.Part2,
                projection: q => new Part2QuestionDto
                {
                    Id = q.Id,
                    AudioUrl = q.AudioUrl!,
                    Name = "Question " + q.Id,
                    Answers = q.Answers.Select(e => new ToeicAnswerDto
                    {
                        Content = e.Content,
                        Key = e.Key,
                    }).ToArray(),
                    TagId = q.Tag.Id,
                    TagName = q.Tag.Name,
                    Type = q.Tag.Type,
                    CreatedAt = q.CreatedAt,
                    UpdatedAt = q.UpdatedAt,
                }) ?? throw new NotFoundException(
                    "Question does not exist.",
                    ApiHelper.ErrorCodes.RESOURCE_NOT_FOUND);

            //for (int i = 0; i < question.Answers.Length; i++)
            //{
            //    question.Answers[i].Content = $"{(char)('A' + i)}.";
            //}

            return new ApiResult<Part2QuestionDto>
            {
                Data = question
            };
        }

        public async Task<ApiResult<Part2QuestionDto>> CreateNewPart2Question(CreateOrUpdatePart2QuestionDto data)
        {
            if (data.Audio == null)
            {
                throw new BadRequestException($"Audio cannot be null");
            }

            if (data.Answers.Count != 3)
            {
                throw new BadRequestException($"Number of answers must be 3, but found {data.Answers.Count}");
            }

            var tag = await _tagRepository.FindAsync(e => 
                e.Id == data.TagId && e.Type == ToeicPartType.Part2)
                ?? throw new BadRequestException(
                    "Tag does not exist or not belong to part 2.",
                    ApiHelper.ErrorCodes.RESOURCE_NOT_FOUND);

            // Create question
            using var audioStream = new MemoryStream();
            await data.Audio.CopyToAsync(audioStream);
            var question = new ToeicQuestion
            {
                AudioUrl = await _storageService.SaveAudio(audioStream)
                    ?? throw new ServerErrorException("Failed to upload question audio file."),
                Explanation = data.Explanation,
                Transcript = data.Transcript,
                CorrectAnswerKey = data.CorrectAnswer,
                Tag = tag,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
            };
            await _questionRepository.AddAsync(question);

            // Create answer
            var answers = new List<ToeicAnswer>();
            for (int i = 0; i < data.Answers.Count; i++)
            {
                answers.Add(new ToeicAnswer
                {
                    Content = data.Answers[i].Content,
                    Key = i + 1,
                    Question = question
                });
            }
            await _answerRepository.AddRangeAsync(answers);
            await _answerRepository.SaveToDatabaseAsync();

            return new ApiResult<Part2QuestionDto>
            {
                Data = new()
                {
                    Id = question.Id,
                    AudioUrl = question.AudioUrl,
                    Answers = question.Answers.Select((e, i) => new ToeicAnswerDto
                    {
                        Content = $"{(char)('A' + i)}. {e.Content}",
                        Key = e.Key,
                    }).ToArray(),
                    TagId = tag.Id,
                    Type = question.Tag.Type,
                    TagName = tag.Name,
                    CreatedAt = question.CreatedAt,
                    UpdatedAt = question.UpdatedAt,
                },
                Message = "Create question successfully"
            };
        }

        public async Task<ApiResult<UpdateResponseDto>> UpdatePart2Question(int id, CreateOrUpdatePart2QuestionDto data)
        {
            var question = await _questionRepository.FindAsync(
                e => e.Id == id && e.Tag.Type == ToeicPartType.Part2)
                ?? throw new NotFoundException(
                    "Lesson does not exists",
                    ApiHelper.ErrorCodes.RESOURCE_NOT_FOUND);

            if (
                data.TagId != question.TagId &&
                !await _tagRepository.ExistsAsync(e => e.Id == data.TagId && e.Type == ToeicPartType.Part2))
            {
                throw new BadRequestException(
                    "Tag does not exist or not belong to part 2.",
                    ApiHelper.ErrorCodes.RESOURCE_NOT_FOUND);
            }

            // Update question
            if (data.Audio != null)
            {
                using var audioStream = new MemoryStream();
                await data.Audio.CopyToAsync(audioStream);
                await _storageService.RemoveAudio(question.AudioUrl!);
                question.AudioUrl = await _storageService.SaveAudio(audioStream);
            }
            question.CorrectAnswerKey = data.CorrectAnswer;
            question.Transcript = data.Transcript;
            question.Explanation = data.Explanation;
            question.UpdatedAt = DateTime.UtcNow;
            question.TagId = data.TagId;


            // Update answer
            var answers = await _answerRepository.GetAllAsync(
                e => e.QuestionId == question.Id,
                sortBy: e => e.Key,
                isAsc: true);
            for (int i = 0; i < 3; i++)
            {
                await _answerRepository.UpdateAsync(
                    answers.ElementAt(i),
                    a => a.Content = data.Answers[i].Content);
            }

            await _questionRepository.UpdateAsync(question);
            await _questionRepository.SaveToDatabaseAsync();

            return new ApiResult<UpdateResponseDto>
            {
                Message = "Update question successfully",
                Data = new UpdateResponseDto
                {
                    Id = question.Id,
                    UpdatedAt = question.UpdatedAt,
                }
            };
        }

        public async Task<ApiResult<Part34QuestionGroupDto>> CreatePart34GroupQuestion(CreateOrUpdatePart34QuestionGroupDto data)
        {
            // Check valid
            if (data.Audio == null)
            {
                throw new BadRequestException($"Audio cannot be null");
            }

            if (data.Questions.Count != 3)
            {
                throw new BadRequestException(
                    $"Number of questions must be 3, but found {data.Questions.Count}");
            }

            foreach (var question in data.Questions)
            {
                if (question.Answers.Count != 4)
                {
                    throw new BadRequestException(
                        $"Number of answers each questions must be 4, but found {question.Answers.Count}");
                }
            }

            var tag = await _tagRepository.FindAsync(e =>
                e.Id == data.TagId && 
                (e.Type == ToeicPartType.Part3 || e.Type == ToeicPartType.Part4))
                ?? throw new BadRequestException(
                    $"Tag does not exist or not belong to part 3,4.",
                    ApiHelper.ErrorCodes.RESOURCE_NOT_FOUND);

            // Create new group
            using var audioStream = new MemoryStream();
            await data.Audio.CopyToAsync(audioStream);
            var group = new ToeicQuestionGroup
            {
                Transcript = data.Transcript,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                Tag = tag,
                AudioUrl = await _storageService.SaveAudio(audioStream)
                    ?? throw new ServerErrorException("Failed to upload question group audio file."),
            };
            if (data.Image != null)
            {
                group.ImageUrl = await _storageService.SaveImage(data.Image)
                    ?? throw new ServerErrorException("Failed to upload question group image file.");
            }

            // Create questions
            var questions = data.Questions.Select(q => new ToeicQuestion
            {
                StringQuestion = q.StringQuestion,
                CorrectAnswerKey = q.CorrectAnswer,
                Explanation = q.Explanation,
                Group = group,
                Tag = tag,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                Answers = q.Answers.Select((a, i) => new ToeicAnswer
                {
                    Content = a.Content,
                    Key = (i + 1),
                }).ToList(),
            }).ToList();

            await _groupRepository.AddAsync(group);
            await _questionRepository.AddRangeAsync(questions);
            await _groupRepository.SaveToDatabaseAsync();

            return new ApiResult<Part34QuestionGroupDto>
            {
                Data = new Part34QuestionGroupDto
                {
                    GroupId = group.Id,
                    GroupName = "Group " + group.Id,
                    AudioUrl = group.AudioUrl,
                    ImageUrl = group.ImageUrl,
                    Questions = group.Questions.Select(q => new Part34QuestionDto
                    {
                        Id = q.Id,
                        StringQuestion = q.StringQuestion!,
                        Name = "Câu hỏi " + q.Id,
                        Answers = q.Answers.Select((e, i) => new ToeicAnswerDto
                        {
                            Content = $"{(char)('A' + i)}. {e.Content}",
                            Key = e.Key,
                        }).ToArray(),
                        TagId = q.Tag.Id,
                        TagName = q.Tag.Name,
                        Type = q.Tag.Type,
                        CreatedAt = q.CreatedAt,
                        UpdatedAt = q.UpdatedAt,
                    }).ToArray()
                }
            };
        }

        public async Task<ApiResult<UpdateResponseDto>> UpdatePart34QuestionGroup(int id, CreateOrUpdatePart34QuestionGroupDto data)
        {
            // Check valid
            if (data.Questions.Count != 3)
            {
                throw new BadRequestException(
                    $"Number of questions must be 3, but found {data.Questions.Count}");
            }

            foreach (var question in data.Questions)
            {
                if (question.Answers.Count != 4)
                {
                    throw new BadRequestException(
                        $"Number of answers each questions must be 4, but found {question.Answers.Count}");
                }
            }

            var group = await _groupRepository.FindAsync(predicate: e => e.Id == id)
                ?? throw new NotFoundException(
                    "Group does not exist.", 
                    ApiHelper.ErrorCodes.RESOURCE_NOT_FOUND);

            var tag = await _tagRepository.FindAsync(e =>
                e.Id == data.TagId &&
                (e.Type == ToeicPartType.Part3 || e.Type == ToeicPartType.Part4))
                ?? throw new BadRequestException(
                    $"Tag does not exist or not belong to part 3,4.",
                    ApiHelper.ErrorCodes.RESOURCE_NOT_FOUND);

            // Check image
            if (data.Image != null)
            {
                if (group.ImageUrl != null)
                {
                    await _storageService.RemoveImage(group.ImageUrl);
                }
                group.ImageUrl = await _storageService.SaveImage(data.Image)
                    ?? throw new ServerErrorException("Failed to upload question group image file.");
            }

            // Check audio
            if (data.Audio != null)
            {
                await _storageService.RemoveImage(group.AudioUrl);
                using var audioStream = new MemoryStream();
                await data.Audio.CopyToAsync(audioStream);
                group.AudioUrl = await _storageService.SaveAudio(audioStream)
                    ?? throw new ServerErrorException("Failed to upload question group audio file.");
            }
            group.Transcript = data.Transcript;
            group.Tag = tag;

            // Update question
            var questions = (await _questionRepository.GetAllAsync(
                predicate: e => e.GroupId == group.Id,
                include: e => e.Answers,
                sortBy: e => e.Id)).ToArray();
            if (questions.Length != 3)
            {
                throw new ServerErrorException(
                    $"The number of questions in group {group.Id} must be 3, please check database.");
            }
            for (int i = 0; i < 3; i++)
            {
                questions[i].StringQuestion = data.Questions[i].StringQuestion;
                questions[i].Explanation = data.Questions[i].Explanation;
                questions[i].CorrectAnswerKey = data.Questions[i].CorrectAnswer;
                questions[i].UpdatedAt = DateTime.UtcNow;

                // Update answers
                if (questions[i].Answers.Count != 4)
                {
                    throw new ServerErrorException(
                        $"The number of answers for question {questions[i].Id} must be 4, please check database.");
                }
                for (int j = 0; j < 4; j++)
                {
                    questions[i].Answers[j].Content = data.Questions[i].Answers[j].Content;
                }
                await _questionRepository.UpdateAsync(questions[i]);
            }

            await _groupRepository.UpdateAsync(group);
            await _groupRepository.SaveToDatabaseAsync();

            return new ApiResult<UpdateResponseDto>
            {
                Message = "Update questions group successfully.",
                Data = new UpdateResponseDto
                {
                    Id = group.Id,
                    UpdatedAt = group.UpdatedAt,
                }
            };
        }

        public async Task<ApiResult<Paginated<Part34QuestionGroupListItemDto>>> GetPart34QuestionsGroupsAsync(
            Part34QuestionGroupSearchDto data, ClaimsPrincipal claims)
        {
            var predicateBuilder = new PredicateBuilder<ToeicQuestionGroup>();
            if (data.Type != null)
            {
                predicateBuilder.AndCondition(e => e.Tag.Type == data.Type);
            } else
            {
                predicateBuilder.AndCondition(e => 
                    e.Tag.Type == ToeicPartType.Part3 ||
                    e.Tag.Type == ToeicPartType.Part4);
            }
            if (data.TagId != null)
            {
                predicateBuilder.AndCondition(e => e.TagId == data.TagId);
            }

            var groups = await _groupRepository.GetPaginatedAsync(
                predicate: predicateBuilder.GetPredicateOrDefault(),
                page: data.Page,
                size: data.Size,
                projection: e => new Part34QuestionGroupListItemDto
                {
                    GroupId = e.Id,
                    GroupName = "Group " + e.Id,
                    TagId = e.Tag.Id,
                    TagName = e.Tag.Name,
                    Type = e.Tag.Type,
                    CreatedAt = e.CreatedAt,
                    UpdatedAt = e.UpdatedAt
                });

            // Check complete
            var userId = Helper.GetUserIdFromClaims(claims);
            if (userId != null)
            {
                var completed = await _groupRepository.GetGroupsProgress(userId.Value);
                foreach (var item in groups.Items)
                {
                    item.IsCompleted = completed.Contains(item.GroupId);
                }
            }

            return new ApiResult<Paginated<Part34QuestionGroupListItemDto>>
            {
                Data = groups
            };
        }

        public async Task<ApiResult<Part34QuestionGroupDto>> GetPart34QuestionGroupAsync(int groupId)
        {
            var group = await _groupRepository.FindAsync(
                predicate: g => g.Id == groupId,
                projection: g => new Part34QuestionGroupDto
                {
                    GroupId = g.Id,
                    GroupName = "Group " + g.Id,
                    AudioUrl = g.AudioUrl,
                    ImageUrl = g.ImageUrl,
                    Questions = g.Questions.Select(q => new Part34QuestionDto
                    {
                        Id = q.Id,
                        StringQuestion = q.StringQuestion!,
                        Name = "Question " + q.Id,
                        Answers = q.Answers.Select(e => new ToeicAnswerDto
                        {
                            Content = e.Content,
                            Key = e.Key,
                        }).ToArray(),
                        TagId = q.Tag.Id,
                        TagName = q.Tag.Name,
                        Type = q.Tag.Type,
                        CreatedAt = q.CreatedAt,
                        UpdatedAt = q.UpdatedAt,
                    }).ToArray()
                })
                ?? throw new NotFoundException(
                    "Group does not exist.",
                    ApiHelper.ErrorCodes.RESOURCE_NOT_FOUND);

            //foreach (var q in group.Questions)
            //{
            //    for (int i = 0; i < 4; i++)
            //    {
            //        q.Answers[i].Content = $"{(char)('A' + i)}. " + q.Answers[i].Content;
            //    }
            //}

            return new ApiResult<Part34QuestionGroupDto>
            {
                Data = group
            };
        }

        public async Task<ApiResult<DeleteResponseDto>> DeletePart34QuestionGroupAsync(int id)
        {
            var group = await _groupRepository.FindAsync(
                predicate: e => e.Id == id)
                ?? throw new NotFoundException(
                    "Group does not exist.",
                    ApiHelper.ErrorCodes.RESOURCE_NOT_FOUND);
            if (group.ImageUrl != null)
            {
                await _storageService.RemoveImage(group.ImageUrl);
            }
            if (group.AudioUrl != null)
            {
                await _storageService.RemoveAudio(group.AudioUrl);
            }

            await _groupRepository.DeleteAsync(group);
            await _groupRepository.SaveToDatabaseAsync();

            return new ApiResult<DeleteResponseDto>
            {
                Message = "Delete group successfully",
                Data = new DeleteResponseDto { Id = group.Id }
            };
        }
    }
}
