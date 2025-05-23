using Core.Modules.Auth.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Data.EntityConfigurations.Auth
{
    public class UserConfiguration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder.ToTable("Users");
            builder.HasKey(e => e.Id);
            builder.Property(e => e.Email).HasColumnType("varchar(255)").IsRequired();
            builder.Property(e => e.FirstName).HasColumnType("varchar(20)").IsRequired();
            builder.Property(e => e.LastName).HasColumnType("varchar(50)").IsRequired();
            builder.Property(e => e.PasswordHash).HasColumnType("char(64)").IsRequired();
            builder.Property(e => e.ImageUrl).HasColumnType("varchar(2048)").IsRequired();

            builder.HasIndex(e => e.Email).IsUnique();
        }
    }
}
