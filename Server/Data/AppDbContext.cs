using Core.Modules.AuthModule.Entities;
using Core.Modules.ChallengeModule.Entities;
using Core.Modules.ListeningModule.Entities;
using Core.Modules.UserModule.Entities;
using Data.EntityConfigurations.AuthModule;
using Data.EntityConfigurations.ChallengeModule;
using Data.EntityConfigurations.ListeningModule;
using Data.EntityConfigurations.UserModule;
using Microsoft.EntityFrameworkCore;

namespace Data
{
    public class AppDbContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<UserRole> UserRoles { get; set; }

        public DbSet<Topic> Topics { get; set; }
        public DbSet<Session> Sessions { get; set; }
        public DbSet<Track> Tracks { get; set; }
        public DbSet<Segment> Segments { get; set; }

        public DbSet<Comment> Comments { get; set; }
        public DbSet<TrackHistory> TrackHistories { get; set; }
        public DbSet<FavouriteTrack> FavouriteTracks { get; set; }
        public DbSet<DailyListenStats> DailyListenStats { get; set; }
        
        public DbSet<Challenge> Challenges { get; set; }
        public DbSet<ChallengeHistory> ChallengeHistories { get; set; }

        public AppDbContext(DbContextOptions options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.ApplyConfiguration(new UserConfiguration());
            builder.ApplyConfiguration(new RoleConfiguration());
            builder.ApplyConfiguration(new UserRoleConfiguration());

            builder.ApplyConfiguration(new TopicConfiguration());
            builder.ApplyConfiguration(new SessionConfiguration());
            builder.ApplyConfiguration(new TrackConfiguration());
            builder.ApplyConfiguration(new SegmentConfiguration());

            builder.ApplyConfiguration(new CommentConfiguration());
            builder.ApplyConfiguration(new TrackHistoryConfiguration());
            builder.ApplyConfiguration(new FavouriteTrackConfiguration());
            builder.ApplyConfiguration(new DailyListenStatsConfiguration());
            
            builder.ApplyConfiguration(new ChallengeConfiguration());
            builder.ApplyConfiguration(new ChallengeHistoryConfiguration());
        }
    }
}
