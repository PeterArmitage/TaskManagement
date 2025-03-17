namespace Backend.Models
{
    using System.Text.Json.Serialization;

    public class Board
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        
        // User foreign key
        public int? UserId { get; set; }
        
        [JsonIgnore]
        public User? User { get; set; }
        
        [JsonIgnore]
        public List<List> Lists { get; set; } = new List<List>();
    }
}