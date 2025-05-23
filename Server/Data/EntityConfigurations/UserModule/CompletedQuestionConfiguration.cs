using Core.Modules.ToeicPracticeModule.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Data.EntityConfigurations.UserModule
{
    public class CompletedQuestionConfiguration : IEntityTypeConfiguration<CompletedQuestion>
    {
        public void Configure(EntityTypeBuilder<CompletedQuestion> builder)
        {
            builder.ToTable("CompletedQuestions");
            builder.HasKey(e => new { e.QuestionId, e.UserId });
            builder.HasOne(cq => cq.User)
                .WithMany(u => u.CompletedQuestions)
                .HasForeignKey(cq => cq.UserId)
                .OnDelete(DeleteBehavior.Restrict);
            builder.HasOne(cq => cq.Question)
                .WithMany(q => q.CompletedQuestions)
                .HasForeignKey(cq => cq.QuestionId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
