using Core.Modules.ToeicPractice.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data.EntityConfigurations.ToeicPractice
{
    public class ToeicAnswerConfiguration : IEntityTypeConfiguration<ToeicAnswer>
    {
        public void Configure(EntityTypeBuilder<ToeicAnswer> builder)
        {
            builder.ToTable("ToeicAnswers");
            builder.HasKey(e => e.Id);
            builder.Property(e => e.Content).HasColumnType("varchar(255)").IsRequired();
            builder.HasOne(a => a.Question)
                .WithMany(q => q.Answers)
                .HasForeignKey(a => a.QuestionId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
