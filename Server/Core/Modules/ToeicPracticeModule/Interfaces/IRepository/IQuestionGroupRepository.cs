using Core.Modules.ToeicPractice.DTOs.Part34;
using Core.Modules.ToeicPractice.Entities;
using Core.Shared.Interfaces.IRepository;
using Core.Shared.Wrappers;

namespace Core.Modules.ToeicPractice.Interfaces.IRepository
{
    public interface IQuestionGroupRepository : IBaseRepository<ToeicQuestionGroup>
    {
        Task<Paginated<Part34QuestionGroupListItemDto>> GetPaginated(Part34QuestionGroupSearchDto data);
        Task<HashSet<int>> GetGroupsProgress(int userId);
    }
}
