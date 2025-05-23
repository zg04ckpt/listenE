using Core.Modules.BasicListening.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Data.EntityConfigurations.BasicListening
{
    public class TrackConfiguration : IEntityTypeConfiguration<Track>
    {
        public void Configure(EntityTypeBuilder<Track> builder)
        {
            builder.ToTable("Tracks");
            builder.HasKey(e => e.Id);
            builder.Property(e => e.Name).HasColumnType("varchar(255)").IsRequired();
            builder.Property(e => e.FullAudioTranscript).HasColumnType("text").IsRequired();
            builder.Property(e => e.FullAudioUrl).HasColumnType("varchar(2048)").IsRequired();
        }
    }
}
