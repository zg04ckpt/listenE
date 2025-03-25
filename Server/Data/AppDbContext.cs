using Core.Modules.AuthModule.Entities;
using Core.Modules.Listening.Entities;
using Data.EntityConfigurations.AuthModule;
using Data.EntityConfigurations.ListeningModule;
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
        public DbSet<TrackHistory> TrackHistories { get; set; }
        public DbSet<FavouriteTrack> FavouriteTracks { get; set; }
        public DbSet<DailyListenStats> DailyListenStats { get; set; }

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
            builder.ApplyConfiguration(new TrackHistoryConfiguration());
            builder.ApplyConfiguration(new FavouriteTrackConfiguration());
            builder.ApplyConfiguration(new DailyListenStatsConfiguration());
        }
    }
}
