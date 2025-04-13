using Core.Modules.UserModule.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Data.EntityConfigurations.UserModule
{
    public class CommentConfiguration : IEntityTypeConfiguration<Comment>
    {
        public void Configure(EntityTypeBuilder<Comment> builder)
        {
            builder.ToTable("Comments");
            builder.HasKey(e => e.Id);
            builder.Property(e => e.Content).HasColumnType("text").IsRequired();

            builder.HasOne(c => c.User)
                .WithMany(u => u.Comments)
                .HasForeignKey(c => c.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(c => c.Track)
                .WithMany(t => t.Comments)
                .HasForeignKey(c => c.TrackId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasIndex(e => e.TrackId);
        }
    }
}
