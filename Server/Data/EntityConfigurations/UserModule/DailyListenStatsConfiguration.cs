using Core.Modules.UserModule.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Data.EntityConfigurations.UserModule
{
    public class DailyListenStatsConfiguration : IEntityTypeConfiguration<DailyListenStats>
    {
        public void Configure(EntityTypeBuilder<DailyListenStats> builder)
        {
            builder.ToTable("DailyListenStats");
            builder.HasKey(e => e.Id);

            builder.HasOne(dls => dls.User)
                .WithMany(u => u.DailyListenStats)
                .HasForeignKey(dls => dls.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasIndex(e => e.UserId);
            builder.HasIndex(e => e.Date);
        }
    }
}
