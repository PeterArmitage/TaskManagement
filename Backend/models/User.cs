namespace Backend.Models
{
    using System.Text.Json.Serialization;

    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        
        [JsonIgnore]
        public string PasswordHash { get; set; } = string.Empty;
        
        [JsonIgnore]
        public List<Board> Boards { get; set; } = new List<Board>();
    }
} 