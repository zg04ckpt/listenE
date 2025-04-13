﻿// <auto-generated />
using System;
using Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace Data.Migrations
{
    [DbContext(typeof(AppDbContext))]
    partial class AppDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "6.0.36")
                .HasAnnotation("Relational:MaxIdentifierLength", 64);

            modelBuilder.Entity("Core.Modules.AuthModule.Entities.Role", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime(6)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("varchar(20)");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("datetime(6)");

                    b.HasKey("Id");

                    b.ToTable("Roles", (string)null);
                });

            modelBuilder.Entity("Core.Modules.AuthModule.Entities.User", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime(6)");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("varchar(255)");

                    b.Property<string>("FirstName")
                        .IsRequired()
                        .HasColumnType("varchar(20)");

                    b.Property<string>("ImageUrl")
                        .IsRequired()
                        .HasColumnType("varchar(2048)");

                    b.Property<bool>("IsActivated")
                        .HasColumnType("tinyint(1)");

                    b.Property<bool>("IsEmailConfirmed")
                        .HasColumnType("tinyint(1)");

                    b.Property<DateTime>("LastLogin")
                        .HasColumnType("datetime(6)");

                    b.Property<string>("LastName")
                        .IsRequired()
                        .HasColumnType("varchar(50)");

                    b.Property<string>("PasswordHash")
                        .IsRequired()
                        .HasColumnType("char(64)");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("datetime(6)");

                    b.HasKey("Id");

                    b.HasIndex("Email")
                        .IsUnique();

                    b.ToTable("Users", (string)null);
                });

            modelBuilder.Entity("Core.Modules.AuthModule.Entities.UserRole", b =>
                {
                    b.Property<int>("UserId")
                        .HasColumnType("int");

                    b.Property<int>("RoleId")
                        .HasColumnType("int");

                    b.HasKey("UserId", "RoleId");

                    b.HasIndex("RoleId");

                    b.ToTable("UserRoles", (string)null);
                });

            modelBuilder.Entity("Core.Modules.ChallengeModule.Entities.Challenge", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<string>("AudioUrl")
                        .IsRequired()
                        .HasColumnType("varchar(2048)");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime(6)");

                    b.Property<DateTime>("EndTime")
                        .HasColumnType("datetime(6)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("varchar(255)");

                    b.Property<DateTime>("StartTime")
                        .HasColumnType("datetime(6)");

                    b.Property<string>("ThumbnailUrl")
                        .IsRequired()
                        .HasColumnType("varchar(2048)");

                    b.Property<string>("Transcript")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("datetime(6)");

                    b.Property<int>("WordCount")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.ToTable("Challenges", (string)null);
                });

            modelBuilder.Entity("Core.Modules.ChallengeModule.Entities.ChallengeHistory", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<int>("ChallengeId")
                        .HasColumnType("int");

                    b.Property<int>("CorrectWordCount")
                        .HasColumnType("int");

                    b.Property<TimeSpan>("Duration")
                        .HasColumnType("time(6)");

                    b.Property<int>("TotalWordCount")
                        .HasColumnType("int");

                    b.Property<int>("UserId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("ChallengeId");

                    b.HasIndex("UserId");

                    b.ToTable("ChallengeHistories", (string)null);
                });

            modelBuilder.Entity("Core.Modules.ListeningModule.Entities.Segment", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<string>("AudioUrl")
                        .IsRequired()
                        .HasColumnType("varchar(2028)");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime(6)");

                    b.Property<TimeSpan>("Duration")
                        .HasColumnType("time(6)");

                    b.Property<int>("OrderInTrack")
                        .HasColumnType("int");

                    b.Property<int>("TrackId")
                        .HasColumnType("int");

                    b.Property<string>("Transcript")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("datetime(6)");

                    b.HasKey("Id");

                    b.HasIndex("TrackId");

                    b.ToTable("Segments", (string)null);
                });

            modelBuilder.Entity("Core.Modules.ListeningModule.Entities.Session", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime(6)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("varchar(255)");

                    b.Property<int>("OrderInTopic")
                        .HasColumnType("int");

                    b.Property<int>("TopicId")
                        .HasColumnType("int");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("datetime(6)");

                    b.HasKey("Id");

                    b.HasIndex("TopicId");

                    b.ToTable("Sessions", (string)null);
                });

            modelBuilder.Entity("Core.Modules.ListeningModule.Entities.Topic", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime(6)");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("varchar(1000)");

                    b.Property<string>("Level")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("varchar(50)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("varchar(255)");

                    b.Property<string>("ThumbnailUrl")
                        .IsRequired()
                        .HasColumnType("varchar(2048)");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("datetime(6)");

                    b.HasKey("Id");

                    b.ToTable("Topics", (string)null);
                });

            modelBuilder.Entity("Core.Modules.ListeningModule.Entities.Track", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime(6)");

                    b.Property<TimeSpan>("FullAudioDuration")
                        .HasColumnType("time(6)");

                    b.Property<string>("FullAudioTranscript")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("FullAudioUrl")
                        .IsRequired()
                        .HasColumnType("varchar(2048)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("varchar(255)");

                    b.Property<int>("OrderInSession")
                        .HasColumnType("int");

                    b.Property<int>("TopicId")
                        .HasColumnType("int");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("datetime(6)");

                    b.HasKey("Id");

                    b.HasIndex("TopicId");

                    b.ToTable("Tracks", (string)null);
                });

            modelBuilder.Entity("Core.Modules.UserModule.Entities.Comment", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<string>("Content")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime(6)");

                    b.Property<int>("TrackId")
                        .HasColumnType("int");

                    b.Property<int>("UserId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("TrackId");

                    b.HasIndex("UserId");

                    b.ToTable("Comments", (string)null);
                });

            modelBuilder.Entity("Core.Modules.UserModule.Entities.DailyListenStats", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<int>("CorrectWordCount")
                        .HasColumnType("int");

                    b.Property<DateTime>("Date")
                        .HasColumnType("datetime(6)");

                    b.Property<int>("FullSegmentCorrectCount")
                        .HasColumnType("int");

                    b.Property<int>("IncorrectWordCount")
                        .HasColumnType("int");

                    b.Property<int>("SegmentCount")
                        .HasColumnType("int");

                    b.Property<int>("UserId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("Date");

                    b.HasIndex("UserId");

                    b.ToTable("DailyListenStats", (string)null);
                });

            modelBuilder.Entity("Core.Modules.UserModule.Entities.FavouriteTrack", b =>
                {
                    b.Property<int>("UserId")
                        .HasColumnType("int");

                    b.Property<int>("TrackId")
                        .HasColumnType("int");

                    b.Property<DateTime>("SavedAt")
                        .HasColumnType("datetime(6)");

                    b.HasKey("UserId", "TrackId");

                    b.HasIndex("TrackId");

                    b.HasIndex("UserId");

                    b.ToTable("FavouriteTracks", (string)null);
                });

            modelBuilder.Entity("Core.Modules.UserModule.Entities.TrackHistory", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<bool>("IsCompleted")
                        .HasColumnType("tinyint(1)");

                    b.Property<string>("Progress")
                        .IsRequired()
                        .HasMaxLength(20)
                        .HasColumnType("varchar(20)");

                    b.Property<DateTime>("StartedAt")
                        .HasColumnType("datetime(6)");

                    b.Property<int>("TrackId")
                        .HasColumnType("int");

                    b.Property<int>("UserId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("TrackId");

                    b.HasIndex("UserId");

                    b.ToTable("TrackHistories", (string)null);
                });

            modelBuilder.Entity("Core.Modules.AuthModule.Entities.UserRole", b =>
                {
                    b.HasOne("Core.Modules.AuthModule.Entities.Role", "Role")
                        .WithMany("UserRoles")
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Core.Modules.AuthModule.Entities.User", "User")
                        .WithMany("UserRoles")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("Role");

                    b.Navigation("User");
                });

            modelBuilder.Entity("Core.Modules.ChallengeModule.Entities.ChallengeHistory", b =>
                {
                    b.HasOne("Core.Modules.ChallengeModule.Entities.Challenge", "Challenge")
                        .WithMany("ChallengeHistories")
                        .HasForeignKey("ChallengeId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Core.Modules.AuthModule.Entities.User", "User")
                        .WithMany("ChallengeHistories")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("Challenge");

                    b.Navigation("User");
                });

            modelBuilder.Entity("Core.Modules.ListeningModule.Entities.Segment", b =>
                {
                    b.HasOne("Core.Modules.ListeningModule.Entities.Track", "Track")
                        .WithMany("Segments")
                        .HasForeignKey("TrackId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Track");
                });

            modelBuilder.Entity("Core.Modules.ListeningModule.Entities.Session", b =>
                {
                    b.HasOne("Core.Modules.ListeningModule.Entities.Topic", "Topic")
                        .WithMany("Sessions")
                        .HasForeignKey("TopicId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Topic");
                });

            modelBuilder.Entity("Core.Modules.ListeningModule.Entities.Track", b =>
                {
                    b.HasOne("Core.Modules.ListeningModule.Entities.Session", "Session")
                        .WithMany("Tracks")
                        .HasForeignKey("TopicId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Session");
                });

            modelBuilder.Entity("Core.Modules.UserModule.Entities.Comment", b =>
                {
                    b.HasOne("Core.Modules.ListeningModule.Entities.Track", "Track")
                        .WithMany("Comments")
                        .HasForeignKey("TrackId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Core.Modules.AuthModule.Entities.User", "User")
                        .WithMany("Comments")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("Track");

                    b.Navigation("User");
                });

            modelBuilder.Entity("Core.Modules.UserModule.Entities.DailyListenStats", b =>
                {
                    b.HasOne("Core.Modules.AuthModule.Entities.User", "User")
                        .WithMany("DailyListenStats")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("User");
                });

            modelBuilder.Entity("Core.Modules.UserModule.Entities.FavouriteTrack", b =>
                {
                    b.HasOne("Core.Modules.ListeningModule.Entities.Track", "Track")
                        .WithMany("FavouriteTracks")
                        .HasForeignKey("TrackId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Core.Modules.AuthModule.Entities.User", "User")
                        .WithMany("FavouriteTracks")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("Track");

                    b.Navigation("User");
                });

            modelBuilder.Entity("Core.Modules.UserModule.Entities.TrackHistory", b =>
                {
                    b.HasOne("Core.Modules.ListeningModule.Entities.Track", "Track")
                        .WithMany("TrackHistories")
                        .HasForeignKey("TrackId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Core.Modules.AuthModule.Entities.User", "User")
                        .WithMany("TrackHistories")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Track");

                    b.Navigation("User");
                });

            modelBuilder.Entity("Core.Modules.AuthModule.Entities.Role", b =>
                {
                    b.Navigation("UserRoles");
                });

            modelBuilder.Entity("Core.Modules.AuthModule.Entities.User", b =>
                {
                    b.Navigation("ChallengeHistories");

                    b.Navigation("Comments");

                    b.Navigation("DailyListenStats");

                    b.Navigation("FavouriteTracks");

                    b.Navigation("TrackHistories");

                    b.Navigation("UserRoles");
                });

            modelBuilder.Entity("Core.Modules.ChallengeModule.Entities.Challenge", b =>
                {
                    b.Navigation("ChallengeHistories");
                });

            modelBuilder.Entity("Core.Modules.ListeningModule.Entities.Session", b =>
                {
                    b.Navigation("Tracks");
                });

            modelBuilder.Entity("Core.Modules.ListeningModule.Entities.Topic", b =>
                {
                    b.Navigation("Sessions");
                });

            modelBuilder.Entity("Core.Modules.ListeningModule.Entities.Track", b =>
                {
                    b.Navigation("Comments");

                    b.Navigation("FavouriteTracks");

                    b.Navigation("Segments");

                    b.Navigation("TrackHistories");
                });
#pragma warning restore 612, 618
        }
    }
}
