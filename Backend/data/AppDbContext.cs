using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Backend.Models;

namespace Backend.Data
{
    public class AppDbContext : DbContext
    {
        private readonly IConfiguration? _configuration;

        // Constructor for runtime (used by dependency injection)
        public AppDbContext(DbContextOptions<AppDbContext> options, IConfiguration configuration)
            : base(options)
        {
            _configuration = configuration;
        }

        // Parameterless constructor for migrations/design-time
        public AppDbContext() { }

        // Configure database provider for migrations
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
{
    if (!optionsBuilder.IsConfigured)
    {
        var connectionString = "Host=dpg-cvfgr05ds78s73flnot0-a.oregon-postgres.render.com;Port=5432;Database=taskmanagementdb_i0ad;Username=taskmanagementdb_i0ad_user;Password=30DW0fsbrLi4byiHtX9w3qrhCeQrxwdD;SslMode=Require;Trust Server Certificate=true;";
        optionsBuilder.UseNpgsql(connectionString);
    }
}
        public DbSet<User> Users { get; set; }
        public DbSet<Board> Boards { get; set; }
        public DbSet<List> Lists { get; set; }
        public DbSet<Card> Cards { get; set; }
        public DbSet<TaskItem> Tasks { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<ChecklistItem> ChecklistItems { get; set; }
        public DbSet<TaskComment> TaskComments { get; set; }
        public DbSet<TaskChecklistItem> TaskChecklistItems { get; set; }
        public DbSet<TaskLabel> TaskLabels { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // User - Board relationship
            modelBuilder.Entity<User>()
                .HasMany(u => u.Boards)
                .WithOne(b => b.User)
                .HasForeignKey(b => b.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // Board - List relationship
            modelBuilder.Entity<Board>()
                .HasMany(b => b.Lists)
                .WithOne(l => l.Board)
                .HasForeignKey(l => l.BoardId)
                .OnDelete(DeleteBehavior.Cascade);

            // List - Card relationship
            modelBuilder.Entity<List>()
                .HasMany(l => l.Cards)
                .WithOne(c => c.List)
                .HasForeignKey(c => c.ListId)
                .OnDelete(DeleteBehavior.Cascade);

            // Card - ChecklistItem relationship
            modelBuilder.Entity<ChecklistItem>(entity =>
            {
                entity.HasOne(ci => ci.Card)
                    .WithMany(c => c.ChecklistItems)
                    .HasForeignKey(ci => ci.CardId)
                    .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}