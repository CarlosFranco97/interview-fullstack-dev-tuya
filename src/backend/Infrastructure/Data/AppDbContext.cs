namespace Infrastructure.Data;

using Microsoft.EntityFrameworkCore;
using Infrastructure.Security;
using Card.Domain.Entities;
using User.Domain.Entities;
using Payment.Domain.Entities;
using Shared.Domain.ValueObjects;

public class AppDbContext : DbContext
{
    private readonly IEncryptionService? _encryptionService;

    public AppDbContext(DbContextOptions<AppDbContext> options, IEncryptionService encryptionService) 
        : base(options)
    {
        _encryptionService = encryptionService;
    }

    // Constructor for migrations (without encryption service)
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; } = null!;
    public DbSet<Card> Cards { get; set; } = null!;
    public DbSet<PaymentEntity> Payments { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>(entity =>
        {
            entity.ToTable("Users");
            entity.HasKey(u => u.Id);
            entity.Property(u => u.Username).IsRequired().HasMaxLength(50);
            entity.HasIndex(u => u.Username).IsUnique();
            
            // Email Value Object mapping
            entity.Property("_email")
                .HasColumnName("Email")
                .IsRequired()
                .HasMaxLength(100);
            entity.HasIndex("_email").IsUnique();
            entity.Ignore(u => u.Email);
            
            entity.Property(u => u.PasswordHash).IsRequired();
            entity.Property(u => u.FullName).IsRequired().HasMaxLength(100);
            entity.Property(u => u.CreatedAt).IsRequired();
            entity.Property(u => u.IsActive).IsRequired();
        });

        modelBuilder.Entity<Card>(entity =>
        {
            entity.ToTable("Cards");
            entity.HasKey(c => c.Id);
            
            // CardNumber Value Object mapping
            entity.Property("_cardNumber")
                .HasColumnName("CardNumber")
                .IsRequired()
                .HasMaxLength(256); // Increased for encrypted value
            entity.HasIndex("_cardNumber").IsUnique();
            entity.Ignore(c => c.CardNumber);
            
            // Note: Encryption is applied transparently via converter when _encryptionService is available
            // For now, we'll apply it in a future migration
            
            entity.Property(c => c.HolderName).IsRequired().HasMaxLength(100);
            entity.Property(c => c.ExpirationDate).IsRequired().HasMaxLength(5);
            
            // Balance Money Value Object mapping
            entity.Property("_balance")
                .HasColumnName("Balance")
                .IsRequired()
                .HasColumnType("decimal(18,2)");
            entity.Ignore(c => c.Balance);
            
            // CreditLimit Money Value Object mapping
            entity.Property("_creditLimit")
                .HasColumnName("CreditLimit")
                .IsRequired()
                .HasColumnType("decimal(18,2)");
            entity.Ignore(c => c.CreditLimit);
            
            entity.Property(c => c.Status)
                .IsRequired()
                .HasConversion<string>();
            entity.Property(c => c.UserId).IsRequired();
            entity.Property(c => c.CreatedAt).IsRequired();
        });

        modelBuilder.Entity<PaymentEntity>(entity =>
        {
            entity.ToTable("Payments");
            entity.HasKey(p => p.Id);
            entity.Property(p => p.CardId).IsRequired();
            entity.Property(p => p.UserId).IsRequired();
            entity.Property(p => p.Amount).IsRequired().HasColumnType("decimal(18,2)");
            entity.Property(p => p.Description).IsRequired().HasMaxLength(200);
            entity.Property(p => p.PaymentDate).IsRequired();
            entity.Property(p => p.Status)
                .IsRequired()
                .HasConversion<string>();
        });
    }
}
