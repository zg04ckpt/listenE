using Core.Modules.ListeningModule.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Data.EntityConfigurations.ListeningModule
{
    public class SegmentConfiguration : IEntityTypeConfiguration<Segment>
    {
        public void Configure(EntityTypeBuilder<Segment> builder)
        {
            builder.ToTable("Segments");
            builder.HasKey(e => e.Id);
            builder.Property(e => e.Transcript).HasColumnType("text").IsRequired();
            builder.Property(e => e.AudioUrl).HasColumnType("varchar(2028)").IsRequired();

            builder.HasOne(s => s.Track)
                .WithMany(t => t.Segments)
                .HasForeignKey(s => s.TrackId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
