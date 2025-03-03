namespace Backend.Models
{
    using System.ComponentModel.DataAnnotations;
    using System.Text.Json.Serialization;

    public class List
    {
        public int Id { get; set; }
        
        [Required]
        [JsonPropertyName("name")]
        public string Name { get; set; } = string.Empty;
        
        [Required]
        [JsonPropertyName("boardId")]
        public int BoardId { get; set; }
        
        [JsonIgnore]
        public Board? Board { get; set; }

        [JsonPropertyName("cards")]
        public List<Card> Cards { get; set; } = new List<Card>();
    }
}