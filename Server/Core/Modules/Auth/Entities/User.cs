using Core.Modules.Listening.Entities;
using Core.Shared.Entities;

namespace Core.Modules.AuthModule.Entities
{
    public class User : ChangeableEntity<Guid>
    {
        public string Email { get; set; }
        public string ImageUrl { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string PasswordHash { get; set; }
        public DateTime LastLogin { get; set; }
        public bool IsActivated { get; set; }
        public bool IsEmailConfirmed { get; set; }

        // Rela
        public List<UserRole> UserRoles { get; set; }
        public List<FavouriteTrack> FavouriteTracks { get; set; }
        public List<TrackHistory> TrackHistories { get; set; }
        public List<DailyListenStats> DailyListenStats { get; set; }
    }
}
