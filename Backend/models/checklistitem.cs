namespace Backend.Models
{
    public class ChecklistItem
    {
        public int Id { get; set; }
        public required string Content { get; set; }
        public bool IsCompleted { get; set; }
        public int CardId { get; set; }
        public Card? Card { get; set; }
    }
}
