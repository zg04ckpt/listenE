using Core.Modules.ToeicPractice.DTOs.Part34;
using Core.Modules.ToeicPractice.Entities;
using Core.Modules.ToeicPractice.Interfaces.IRepository;
using Core.Shared.Exceptions;
using Core.Shared.Wrappers;
using Microsoft.EntityFrameworkCore;

namespace Data.Repositories
{
    public class QuestionGroupRepository : BaseRepository<ToeicQuestionGroup>, IQuestionGroupRepository
    {
        public QuestionGroupRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<HashSet<int>> GetGroupsProgress(int userId)
        {
            if (!await _context.Users.AnyAsync(e => e.Id == userId))
            {
                throw new ServerErrorException("Cannot get groups progress because user does not exist.");
            }
            var progress = await _context.Users.AsNoTracking()
                .Where(e => e.Id == userId)
                .SelectMany(u => u.CompletedQuestions
                    .Where(cq => cq.Question.GroupId != null)
                    .Select(cq => cq.Question.GroupId!.Value))
                .Distinct()
                .ToListAsync();

            return progress.ToHashSet();
        }

        public async Task<Paginated<Part34QuestionGroupListItemDto>> GetPaginated(
            Part34QuestionGroupSearchDto data)
        {
            var query = _context.ToeicQuestions.AsNoTracking()
                .Where(q => q.GroupId != null); ;
            if (data.TagId != null)
            {
                query = query.Where(q => q.TagId == data.TagId);
            }

            var groups = await query
                .GroupBy(q => q.GroupId!)
                .OrderBy(g => g.Key)
                .Skip(data.Size * (data.Page - 1))
                .Take(data.Size)
                .Select(g => new Part34QuestionGroupListItemDto
                {
                    GroupId = g.Key!.Value,
                    GroupName = "Group " + g.Key.Value,
                    TagId = g.First().TagId,
                    TagName = g.First().Tag.Name,
                }).ToArrayAsync();

            return new Paginated<Part34QuestionGroupListItemDto>
            {
                Page = data.Page,
                Size = data.Size,
                Items = groups
            };
        }
    }
}
