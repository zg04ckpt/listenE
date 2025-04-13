using Core.Modules.ListeningModule.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Data.EntityConfigurations.ListeningModule
{
    public class SessionConfiguration : IEntityTypeConfiguration<Session>
    {
        public void Configure(EntityTypeBuilder<Session> builder)
        {
            builder.ToTable("Sessions");
            builder.HasKey(e => e.Id);
            builder.Property(e => e.Name).HasColumnType("varchar(255)").IsRequired();

            builder.HasOne(s => s.Topic)
                .WithMany(t => t.Sessions)
                .HasForeignKey(s => s.TopicId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasIndex(e => e.TopicId);
        }
    }
}
