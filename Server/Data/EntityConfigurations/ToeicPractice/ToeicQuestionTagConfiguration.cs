using Core.Modules.ToeicPractice.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Data.EntityConfigurations.ToeicPractice
{
    public class ToeicQuestionTagConfiguration : IEntityTypeConfiguration<ToeicQuestionTag>
    {
        public void Configure(EntityTypeBuilder<ToeicQuestionTag> builder)
        {
            builder.ToTable("ToeicQuestionTags");
            builder.HasKey(e => e.Id);
            builder.Property(e => e.Type).HasConversion<string>().HasColumnType("varchar(50)");
            builder.Property(e => e.Name).HasColumnType("varchar(255)").IsRequired();
        }
    }
}
