namespace Backend.Models
{
    public class Card
    {
        public int Id { get; set; }
        public required string Title { get; set; }
        public required string Description { get; set; }
        public DateTime DueDate { get; set; }
        public int ListId { get; set; }
        public required List List { get; set; }
    }
}