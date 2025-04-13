using Core.Modules.ChallengeModule.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data.EntityConfigurations.ChallengeModule
{
    public class ChallengeConfiguration : IEntityTypeConfiguration<Challenge>
    {
        public void Configure(EntityTypeBuilder<Challenge> builder)
        {
            builder.ToTable("Challenges");
            builder.HasKey(e => e.Id);
            builder.Property(e => e.Name).HasColumnType("varchar(255)").IsRequired();
            builder.Property(e => e.ThumbnailUrl).HasColumnType("varchar(2048)").IsRequired();
            builder.Property(e => e.AudioUrl).HasColumnType("varchar(2048)").IsRequired();
            builder.Property(e => e.Transcript).HasColumnType("text").IsRequired();
        }
    }
}
