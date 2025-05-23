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
    public class ToeicQuestionGroupConfiguration : IEntityTypeConfiguration<ToeicQuestionGroup>
    {
        public void Configure(EntityTypeBuilder<ToeicQuestionGroup> builder)
        {
            builder.ToTable("ToeicQuestionGroups");
            builder.HasKey(e => e.Id);
            builder.Property(e => e.ImageUrl).HasColumnType("varchar(2048)").IsRequired(false);
            builder.Property(e => e.AudioUrl).HasColumnType("varchar(2048)").IsRequired();
            builder.Property(e => e.Transcript).HasColumnType("text").IsRequired();

            builder.HasOne(qg => qg.Tag)
                .WithMany(t => t.QuestionGroups)
                .HasForeignKey(q => q.TagId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
