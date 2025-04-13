using Core.Modules.ChallengeModule.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Data.EntityConfigurations.ChallengeModule
{
    public class ChallengeHistoryConfiguration : IEntityTypeConfiguration<ChallengeHistory>
    {
        public void Configure(EntityTypeBuilder<ChallengeHistory> builder)
        {
            builder.ToTable("ChallengeHistories");
            builder.HasKey(e => e.Id);

            builder.HasOne(ch => ch.User)
                .WithMany(u => u.ChallengeHistories)
                .HasForeignKey(ch => ch.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(ch => ch.Challenge)
                .WithMany(c => c.ChallengeHistories)
                .HasForeignKey(ch => ch.ChallengeId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
