using Core.Modules.Listening.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data.EntityConfigurations.ListeningModule
{
    public class SessionConfiguration : IEntityTypeConfiguration<Session>
    {
        public void Configure(EntityTypeBuilder<Session> builder)
        {
            builder.ToTable("Sessions");
            builder.HasKey(e => e.Id);
            builder.Property(e => e.Name).HasMaxLength(50);

            builder.HasOne(s => s.Topic)
                .WithMany(t => t.Sessions)
                .HasForeignKey(s => s.TopicId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
