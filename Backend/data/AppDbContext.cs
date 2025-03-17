using Microsoft.EntityFrameworkCore;
using Backend.Models;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Data
{
    public class AppDbContext : DbContext
    {
        private readonly IConfiguration _configuration;

        public DbSet<User> Users { get; set; }
        public DbSet<Board> Boards { get; set; }
        public DbSet<List> Lists { get; set; }
        public DbSet<Card> Cards { get; set; }
        public DbSet<TaskItem> Tasks { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<ChecklistItem> ChecklistItems { get; set; }

        public AppDbContext(DbContextOptions<AppDbContext> options, IConfiguration configuration)
            : base(options)
        {
            _configuration = configuration;
        }

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