﻿using Core.Modules.Listening.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Data.EntityConfigurations.ListeningModule
{
    public class FavouriteTrackConfiguration : IEntityTypeConfiguration<FavouriteTrack>
    {
        public void Configure(EntityTypeBuilder<FavouriteTrack> builder)
        {
            builder.ToTable("FavouriteTracks");
            builder.HasKey(e => new { e.UserId, e.TrackId });
            builder.HasIndex(e => new { e.UserId, e.TrackId }).IsUnique();

            builder.HasOne(ft => ft.User)
                .WithMany(u => u.FavouriteTracks)
                .HasForeignKey(u => u.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(ft => ft.Track)
                .WithMany(t => t.FavouriteTracks)
                .HasForeignKey(ft => ft.TrackId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
