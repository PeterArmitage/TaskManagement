namespace Backend.Models
{
    public class List
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public int BoardId { get; set; }
        public required Board Board { get; set; }
        public List<Card> Cards { get; set; } = new List<Card>();
    }
}