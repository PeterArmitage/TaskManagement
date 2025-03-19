using System.Text.Json.Serialization;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    public class TaskComment
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        public int TaskId { get; set; }
        
        [Required]
        public required string Content { get; set; }
        
        public string CreatedAt { get; set; } = DateTime.Now.ToString("o");
        
        public string? Author { get; set; }
        
        [ForeignKey("TaskId")]
        public TaskItem? Task { get; set; }
    }

    public class TaskChecklistItem
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        public int TaskId { get; set; }
        
        [Required]
        public required string Content { get; set; }
        
        public bool IsCompleted { get; set; }
        
        [ForeignKey("TaskId")]
        public TaskItem? Task { get; set; }
    }

    public class TaskLabel
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        public int TaskId { get; set; }
        
        [Required]
        public required string Name { get; set; }
        
        [Required]
        public required string Color { get; set; }
        
        [ForeignKey("TaskId")]
        public TaskItem? Task { get; set; }
    }

    public class TaskItem
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        public required string Title { get; set; }
        
        [Required]
        public required string Description { get; set; }
        
        public bool IsCompleted { get; set; }
        
        [Required]
        public required string DueDate { get; set; }
        
        public string Status { get; set; } = "Pending";
        
        public string CreatedAt { get; set; } = DateTime.Now.ToString("o");
        
        public string? Priority { get; set; }
        
        public string? AssignedTo { get; set; }
        
        [JsonPropertyName("comments")]
        public List<TaskComment>? Comments { get; set; } = new List<TaskComment>();
        
        [JsonPropertyName("checklist")]
        public List<TaskChecklistItem>? Checklist { get; set; } = new List<TaskChecklistItem>();
        
        [JsonPropertyName("labels")]
        public List<TaskLabel>? Labels { get; set; } = new List<TaskLabel>();
    }
}