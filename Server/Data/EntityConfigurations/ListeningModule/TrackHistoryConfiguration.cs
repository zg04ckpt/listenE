using Core.Modules.Listening.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Data.EntityConfigurations.ListeningModule
{
    public class TrackHistoryConfiguration : IEntityTypeConfiguration<TrackHistory>
    {
        public void Configure(EntityTypeBuilder<TrackHistory> builder)
        {
            builder.ToTable("TrackHistories");
            builder.HasKey(e => e.Id);
            builder.Property(e => e.TrackId).IsRequired(false);
            builder.Property(e => e.Progress).HasMaxLength(20);

            builder.HasOne(th => th.User)
                .WithMany(u => u.TrackHistories)
                .HasForeignKey(th => th.UserId);
            
            builder.HasOne(th => th.Track)
                .WithMany(t => t.TrackHistories)
                .HasForeignKey(th => th.TrackId)
                .OnDelete(DeleteBehavior.SetNull);
        }
    }
}
