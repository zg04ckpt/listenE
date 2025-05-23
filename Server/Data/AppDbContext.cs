using Core.Modules.Auth.Entities;
using Core.Modules.BasicListening.Entities;
using Core.Modules.ToeicPractice.Entities;
using Core.Modules.ToeicPracticeModule.Entities;
using Core.Shared.Entities;
using Data.EntityConfigurations;
using Data.EntityConfigurations.Auth;
using Data.EntityConfigurations.BasicListening;
using Data.EntityConfigurations.ToeicPractice;
using Microsoft.EntityFrameworkCore;

namespace Data
{
    public class AppDbContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<UserRole> UserRoles { get; set; }

        public DbSet<Topic> Topics { get; set; }
        public DbSet<Track> Tracks { get; set; }
        public DbSet<Segment> Segments { get; set; }

        public DbSet<ToeicQuestionGroup> ToeicListeningQuestionGroups { get; set; }
        public DbSet<ToeicQuestion> ToeicQuestions { get; set; }
        public DbSet<ToeicAnswer> ToeicAnswers { get; set; }
        public DbSet<CompletedQuestion> CompletedQuestions { get; set; }

        public AppDbContext(DbContextOptions options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.ApplyConfiguration(new UserConfiguration());
            builder.ApplyConfiguration(new RoleConfiguration());
            builder.ApplyConfiguration(new UserRoleConfiguration());

            builder.ApplyConfiguration(new TopicConfiguration());
            builder.ApplyConfiguration(new TrackConfiguration());
            builder.ApplyConfiguration(new SegmentConfiguration());

            builder.ApplyConfiguration(new ToeicAnswerConfiguration());
            builder.ApplyConfiguration(new ToeicQuestionGroupConfiguration());
            builder.ApplyConfiguration(new ToeicQuestionTagConfiguration());
            builder.ApplyConfiguration(new ToeicQuestionConfiguration());
            builder.ApplyConfiguration(new CompletedQuestionConfiguration());
        }
    }
}
