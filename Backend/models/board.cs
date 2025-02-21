namespace Backend.Models
{
    public class Board
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public required string Description { get; set; }
        public List<List> Lists { get; set; } = new List<List>();
    }
}