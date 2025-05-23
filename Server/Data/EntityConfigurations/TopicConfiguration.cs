using Core.Shared.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Data.EntityConfigurations
{
    public class TopicConfiguration : IEntityTypeConfiguration<Topic>
    {
        public void Configure(EntityTypeBuilder<Topic> builder)
        {
            builder.ToTable("Topics");
            builder.HasKey(e => e.Id);
            builder.Property(e => e.Name).HasColumnType("varchar(255)").IsRequired();
            builder.Property(e => e.Type).HasConversion<string>().HasColumnType("varchar(100)").IsRequired();
            builder.Property(e => e.Description).HasColumnType("varchar(1000)").IsRequired();
            builder.Property(e => e.ThumbnailUrl).HasColumnType("varchar(2048)").IsRequired();
        }
    }
}
