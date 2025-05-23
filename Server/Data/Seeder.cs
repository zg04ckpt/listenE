using Core.Modules.Auth.Entities;
using Core.Modules.ToeicPractice.Enums;
using Core.Shared.Entities;
using Core.Shared.Exceptions;
using Core.Shared.Utilities;
using Microsoft.EntityFrameworkCore;

namespace Data
{
    public static class Seeder
    {
        public static async Task SeedData(AppDbContext _context)
        {
            await _context.Database.MigrateAsync();
            await Seed(_context);
            await _context.SaveChangesAsync();
        }

        private static async Task Seed(AppDbContext _context)
        {
            // Create default roles and user
            try
            {
                if (!await _context.Roles.AnyAsync())
                {
                    var roles = new Role[] 
                    { 
                        new Role
                        {
                            Name = "Admin",
                            CreatedAt = DateTime.UtcNow,
                            UpdatedAt = DateTime.UtcNow
                        },
                        new Role
                        {
                            Name = "User",
                            CreatedAt = DateTime.UtcNow,
                            UpdatedAt = DateTime.UtcNow
                        },
                        new Role
                        {
                            Name = "Manager",
                            CreatedAt = DateTime.UtcNow,
                            UpdatedAt = DateTime.UtcNow
                        },
                    };
                    await _context.AddRangeAsync(roles);

                }

                if (!await _context.Users.AnyAsync())
                {
                    var admin = new User
                    {
                        FirstName = "Admin",
                        LastName = "System",
                        ImageUrl = "https://res.cloudinary.com/dvk5yt0oi/image/upload/v1742443035/listene/images/hseg5ibhbspzopkced45.jpg",
                        Email = EnvHelper.GetAdminEmail(),
                        IsActivated = true,
                        IsEmailConfirmed = true,
                        PasswordHash = PasswordHasher.Hash(EnvHelper.GetAdminPassword()),
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow,
                        LastLogin = DateTime.UtcNow
                    };

                    var manager = new User
                    {
                        FirstName = "Manager",
                        LastName = "System",
                        ImageUrl = "https://res.cloudinary.com/dvk5yt0oi/image/upload/v1742443035/listene/images/hseg5ibhbspzopkced45.jpg",
                        Email = "manager@listene.com",
                        IsActivated = true,
                        IsEmailConfirmed = true,
                        PasswordHash = PasswordHasher.Hash("Manager@123"),
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow,
                        LastLogin = DateTime.UtcNow
                    };

                    await _context.Users.AddAsync(admin);
                    await _context.Users.AddAsync(manager);
                    await _context.UserRoles.AddAsync(new UserRole()
                    {
                        User = admin,
                        Role = _context.Roles.First(e => e.Name == "Admin")
                    });
                    await _context.UserRoles.AddAsync(new UserRole()
                    {
                        User = manager,
                        Role = _context.Roles.First(e => e.Name == "Manager")
                    });
                }

            }
            catch (Exception ex)
            {
                throw new DatabaseException($"Failed to initialize default roles: " + ex.Message);
            }

            // Seed topics
            try
            {
                if (!await _context.Topics.AnyAsync())
                {
                    var topics = new List<Topic>()
                {
                    new Topic()
                    {
                        Type = ToeicPartType.BasicPractice,
                        Name = "Basic Listening Practice",
                        Description = "Luyện nghe từng câu",
                        ThumbnailUrl = "https://res.cloudinary.com/dvk5yt0oi/image/upload/v1742779154/listene/images/stckvmtquibd4zszgu91.jpg",
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow,
                    },
                    new Topic()
                    {
                        Type = ToeicPartType.Part1,
                        Name = "Toeic Part 1",
                        Description = "Luyện nghe phần 1 của bài thi Toeic",
                        ThumbnailUrl = "https://res.cloudinary.com/dvk5yt0oi/image/upload/v1742779154/listene/images/stckvmtquibd4zszgu91.jpg",
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow,
                    },
                    new Topic()
                    {
                        Type = ToeicPartType.Part2,
                        Name = "Toeic Part 2",
                        Description = "Luyện nghe phần 2 của bài thi Toeic",
                        ThumbnailUrl = "https://res.cloudinary.com/dvk5yt0oi/image/upload/v1742779154/listene/images/stckvmtquibd4zszgu91.jpg",
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow,
                    },
                    new Topic()
                    {
                        Type = ToeicPartType.Part3,
                        Name = "Toeic Part 3",
                        Description = "Luyện nghe phần 3 của bài thi Toeic",
                        ThumbnailUrl = "https://res.cloudinary.com/dvk5yt0oi/image/upload/v1742779154/listene/images/stckvmtquibd4zszgu91.jpg",
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow,
                    },
                    new Topic()
                    {
                        Type = ToeicPartType.Part4,
                        Name = "Toeic Part 4",
                        Description = "Luyện nghe phần 4 của bài thi Toeic",
                        ThumbnailUrl = "https://res.cloudinary.com/dvk5yt0oi/image/upload/v1742779154/listene/images/stckvmtquibd4zszgu91.jpg",
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow,
                    },
                };
                    await _context.Topics.AddRangeAsync(topics);
                }
            }
            catch (Exception ex)
            {
                throw new DatabaseException($"Failed to initialize default topics: " + ex.Message);
            }
        }
    }
}
