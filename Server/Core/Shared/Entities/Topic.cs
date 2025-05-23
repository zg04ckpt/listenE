using Core.Modules.BasicListening.Enums;
using Core.Modules.ToeicPractice.Entities;
using Core.Modules.ToeicPractice.Enums;

namespace Core.Shared.Entities
{
    public class Topic : ChangeableEntity<int>
    {
        public ToeicPartType Type { get; set; }
        public string Name { get; set; }
        public string ThumbnailUrl { get; set; }
        public string Description { get; set; }
    }
}
