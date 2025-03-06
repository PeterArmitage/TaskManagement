namespace Backend.Models
{
    public class Comment
    {
        public int Id { get; set; }
        public required string Content { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public int CardId { get; set; }
        public Card? Card { get; set; }
    }
}