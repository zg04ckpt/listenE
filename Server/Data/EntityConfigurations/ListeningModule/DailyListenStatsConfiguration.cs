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
    public class DailyListenStatsConfiguration : IEntityTypeConfiguration<DailyListenStats>
    {
        public void Configure(EntityTypeBuilder<DailyListenStats> builder)
        {
            builder.ToTable("DailyListenStats");
            builder.HasKey(e => e.Id);
            builder.HasIndex(e => e.UserId);

            builder.HasOne(dls => dls.User)
                .WithMany(u => u.DailyListenStats)
                .HasForeignKey(dls => dls.UserId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
