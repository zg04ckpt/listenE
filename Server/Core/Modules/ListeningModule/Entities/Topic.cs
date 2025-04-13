using Core.Modules.ListeningModule.Enums;
using Core.Shared.Entities;

namespace Core.Modules.ListeningModule.Entities
{
    public class Topic : ChangeableEntity<int>
    {
        public string Name { get; set; }
        public TopicLevel Level { get; set; }
        public string ThumbnailUrl { get; set; }
        public string Description { get; set; }
        // Rela
        public List<Session> Sessions { get; set; }
    }
}
