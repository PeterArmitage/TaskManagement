using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;
using System.Text.Json;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Produces("application/json")]
    public class TasksController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly JsonSerializerOptions _jsonOptions;
        private bool _tablesInitialized = false;

        public TasksController(AppDbContext context)
        {
            _context = context;
            _jsonOptions = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                WriteIndented = true
            };
            
          
        }

      

        
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TaskItem>>> GetTasks()
        {
            try
            {
               
                
                var tasks = await _context.Tasks.ToListAsync();
                
                // Load relationships for each task
                foreach (var task in tasks)
                {
                    try
                    {
                        // Load comments
                        var comments = await _context.Set<TaskComment>()
                            .Where(c => c.TaskId == task.Id)
                            .ToListAsync();
                        task.Comments = comments;
                        
                        // Load checklist items
                        var checklistItems = await _context.Set<TaskChecklistItem>()
                            .Where(c => c.TaskId == task.Id)
                            .ToListAsync();
                        task.Checklist = checklistItems;
                        
                        // Load labels
                        var labels = await _context.Set<TaskLabel>()
                            .Where(l => l.TaskId == task.Id)
                            .ToListAsync();
                        task.Labels = labels;
                    }
                    catch (Exception ex)
                    {
                        // If loading relationships fails, just continue with basic task data
                        Console.WriteLine($"Error loading relationships for task {task.Id}: {ex.Message}");
                    }
                }
                
                return Ok(tasks);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        
        [HttpGet("{id}")]
        public async Task<ActionResult<TaskItem>> GetTask(int id)
        {
            try
            {
                
                
                var task = await GetTaskWithRelationships(id);
                if (task == null)
                {
                    return NotFound();
                }
                return Ok(task);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        
        [HttpPost]
        public async Task<ActionResult<TaskItem>> CreateTask(TaskItem task)
        {
            try
            {
                
                
                if (task == null)
                {
                    return BadRequest("Task is null.");
                }

                // Validate date format
                if (!DateTime.TryParse(task.DueDate, out _))
                {
                    return BadRequest("Invalid DueDate format. Use 'yyyy-MM-dd'.");
                }

                // Set default values if missing
                if (string.IsNullOrEmpty(task.Status))
                {
                    task.Status = "Pending";
                }
                
                if (string.IsNullOrEmpty(task.CreatedAt))
                {
                    task.CreatedAt = DateTime.Now.ToString("o");
                }

                // Save the task to get its ID
                _context.Tasks.Add(task);
                await _context.SaveChangesAsync();

                // Process comments if they exist
                if (task.Comments != null && task.Comments.Count > 0)
                {
                    await SaveTaskComments(task.Id, task.Comments);
                }

                // Process checklist items if they exist
                if (task.Checklist != null && task.Checklist.Count > 0)
                {
                    await SaveTaskChecklistItems(task.Id, task.Checklist);
                }

                // Process labels if they exist
                if (task.Labels != null && task.Labels.Count > 0)
                {
                    await SaveTaskLabels(task.Id, task.Labels);
                }

                // Reload the task with all its relationships
                var createdTask = await GetTaskWithRelationships(task.Id);
                if (createdTask == null)
                {
                    return NotFound();
                }

                return CreatedAtAction(nameof(GetTask), new { id = createdTask.Id }, createdTask);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTask(int id, TaskItem task)
        {
            try
            {
                
                
                if (id != task.Id)
                {
                    return BadRequest();
                }

                // Check if task exists
                var existingTask = await _context.Tasks.FindAsync(id);
                if (existingTask == null)
                {
                    return NotFound();
                }

                // Update task properties
                existingTask.Title = task.Title;
                existingTask.Description = task.Description;
                existingTask.IsCompleted = task.IsCompleted;
                existingTask.DueDate = task.DueDate;
                existingTask.Status = task.Status;
                existingTask.Priority = task.Priority;
                existingTask.AssignedTo = task.AssignedTo;

                // Update the task
                _context.Entry(existingTask).State = EntityState.Modified;
                await _context.SaveChangesAsync();

                // Process comments
                if (task.Comments != null)
                {
                    await SaveTaskComments(id, task.Comments);
                }

                // Process checklist items
                if (task.Checklist != null)
                {
                    await SaveTaskChecklistItems(id, task.Checklist);
                }

                // Process labels
                if (task.Labels != null)
                {
                    await SaveTaskLabels(id, task.Labels);
                }

                // Return the updated task with all relationships
                var updatedTask = await GetTaskWithRelationships(id);
                return Ok(updatedTask);
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Tasks.Any(t => t.Id == id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

       
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTask(int id)
        {
            try
            {
                
                
                var task = await _context.Tasks.FindAsync(id);
                if (task == null)
                {
                    return NotFound();
                }

                _context.Tasks.Remove(task);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // Helper methods for managing relationships
        private async Task<TaskItem?> GetTaskWithRelationships(int taskId)
        {
         
            
            var task = await _context.Tasks.FindAsync(taskId);
            if (task == null)
            {
                return null;
            }

            try
            {
                // Load comments
                var comments = await _context.Set<TaskComment>()
                    .Where(c => c.TaskId == taskId)
                    .ToListAsync();
                task.Comments = comments;

                // Load checklist items
                var checklistItems = await _context.Set<TaskChecklistItem>()
                    .Where(c => c.TaskId == taskId)
                    .ToListAsync();
                task.Checklist = checklistItems;

                // Load labels
                var labels = await _context.Set<TaskLabel>()
                    .Where(l => l.TaskId == taskId)
                    .ToListAsync();
                task.Labels = labels;
            }
            catch (Exception ex)
            {
                // If loading relationships fails, just continue with basic task data
                Console.WriteLine($"Error loading relationships for task {taskId}: {ex.Message}");
            }

            return task;
        }

        private async Task SaveTaskComments(int taskId, List<TaskComment> comments)
        {
      
            
            try
            {
                // Get existing comments
                var existingComments = await _context.Set<TaskComment>()
                    .Where(c => c.TaskId == taskId)
                    .ToListAsync();

                // Remove comments not in the updated list
                foreach (var existingComment in existingComments)
                {
                    if (!comments.Any(c => c.Id == existingComment.Id))
                    {
                        _context.Set<TaskComment>().Remove(existingComment);
                    }
                }

                foreach (var comment in comments)
                {
                    comment.TaskId = taskId;
                    
                    if (comment.Id > 0)
                    {
                        // Update existing comment
                        var existingComment = await _context.Set<TaskComment>().FindAsync(comment.Id);
                        if (existingComment != null)
                        {
                            existingComment.Content = comment.Content;
                            existingComment.Author = comment.Author;
                            _context.Entry(existingComment).State = EntityState.Modified;
                        }
                    }
                    else
                    {
                        // Add new comment
                        _context.Set<TaskComment>().Add(comment);
                    }
                }

                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error saving comments for task {taskId}: {ex.Message}");
            }
        }

        private async Task SaveTaskChecklistItems(int taskId, List<TaskChecklistItem> checklistItems)
        {
         
            try
            {
                // Get existing checklist items
                var existingItems = await _context.Set<TaskChecklistItem>()
                    .Where(c => c.TaskId == taskId)
                    .ToListAsync();

                // Remove items not in the updated list
                foreach (var existingItem in existingItems)
                {
                    if (!checklistItems.Any(c => c.Id == existingItem.Id))
                    {
                        _context.Set<TaskChecklistItem>().Remove(existingItem);
                    }
                }

                foreach (var item in checklistItems)
                {
                    item.TaskId = taskId;
                    
                    if (item.Id > 0)
                    {
                        // Update existing item
                        var existingItem = await _context.Set<TaskChecklistItem>().FindAsync(item.Id);
                        if (existingItem != null)
                        {
                            existingItem.Content = item.Content;
                            existingItem.IsCompleted = item.IsCompleted;
                            _context.Entry(existingItem).State = EntityState.Modified;
                        }
                    }
                    else
                    {
                        // Add new item
                        _context.Set<TaskChecklistItem>().Add(item);
                    }
                }

                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error saving checklist items for task {taskId}: {ex.Message}");
            }
        }

        private async Task SaveTaskLabels(int taskId, List<TaskLabel> labels)
        {
           
            
            try
            {
                // Get existing labels
                var existingLabels = await _context.Set<TaskLabel>()
                    .Where(l => l.TaskId == taskId)
                    .ToListAsync();

                // Remove labels not in the updated list
                foreach (var existingLabel in existingLabels)
                {
                    if (!labels.Any(l => l.Id == existingLabel.Id))
                    {
                        _context.Set<TaskLabel>().Remove(existingLabel);
                    }
                }

                foreach (var label in labels)
                {
                    label.TaskId = taskId;
                    
                    if (label.Id > 0)
                    {
                        // Update existing label
                        var existingLabel = await _context.Set<TaskLabel>().FindAsync(label.Id);
                        if (existingLabel != null)
                        {
                            existingLabel.Name = label.Name;
                            existingLabel.Color = label.Color;
                            _context.Entry(existingLabel).State = EntityState.Modified;
                        }
                    }
                    else
                    {
                        // Add new label
                        _context.Set<TaskLabel>().Add(label);
                    }
                }

                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error saving labels for task {taskId}: {ex.Message}");
            }
        }
    }
}