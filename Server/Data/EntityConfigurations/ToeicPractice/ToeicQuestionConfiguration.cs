using Core.Modules.ToeicPractice.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Data.EntityConfigurations.ToeicPractice
{
    public class ToeicQuestionConfiguration : IEntityTypeConfiguration<ToeicQuestion>
    {
        public void Configure(EntityTypeBuilder<ToeicQuestion> builder)
        {
            builder.ToTable("ToeicQuestions");
            builder.HasKey(e => e.Id);
            builder.Property(e => e.StringQuestion).HasColumnType("varchar(255)").IsRequired(false);
            builder.Property(e => e.ImageUrl).HasColumnType("varchar(2048)").IsRequired(false);
            builder.Property(e => e.AudioUrl).HasColumnType("varchar(2048)").IsRequired(false);
            builder.Property(e => e.Transcript).HasColumnType("text").IsRequired(false);
            builder.Property(e => e.Explanation).HasColumnType("text").IsRequired();
            
            builder.HasOne(q => q.Group)
                .WithMany(qg => qg.Questions)
                .HasForeignKey(q => q.GroupId)
                .OnDelete(DeleteBehavior.Cascade);
            builder.HasOne(q => q.Tag)
                .WithMany(t => t.Questions)
                .HasForeignKey(q => q.TagId)
                .OnDelete(DeleteBehavior.Restrict);
        }  
    }
}
