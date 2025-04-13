using Core.Modules.ListeningModule.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Data.EntityConfigurations.ListeningModule
{
    public class TopicConfiguration : IEntityTypeConfiguration<Topic>
    {
        public void Configure(EntityTypeBuilder<Topic> builder)
        {
            builder.ToTable("Topics");
            builder.HasKey(e => e.Id);
            builder.Property(e => e.Level).HasMaxLength(50).HasConversion<string>();
            builder.Property(e => e.Name).HasColumnType("varchar(255)").IsRequired();
            builder.Property(e => e.Description).HasColumnType("varchar(1000)").IsRequired();
            builder.Property(e => e.ThumbnailUrl).HasColumnType("varchar(2048)").IsRequired();
        }
    }
}
