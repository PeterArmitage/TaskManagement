using Microsoft.AspNetCore.Mvc;
using Backend.Models;
using Backend.Data;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChecklistItemsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ChecklistItemsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<ActionResult<ChecklistItem>> CreateChecklistItem([FromBody] ChecklistItem item)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var card = await _context.Cards.FindAsync(item.CardId);
            if (card == null) return NotFound("Card not found");

            _context.ChecklistItems.Add(item);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetChecklistItem), new { id = item.Id }, item);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateChecklistItem(int id, [FromBody] ChecklistItem item)
        {
            if (id != item.Id) return BadRequest();

            var existingItem = await _context.ChecklistItems.FindAsync(id);
            if (existingItem == null) return NotFound();

            existingItem.Content = item.Content;
            existingItem.IsCompleted = item.IsCompleted;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteChecklistItem(int id)
        {
            var item = await _context.ChecklistItems.FindAsync(id);
            if (item == null) return NotFound();

            _context.ChecklistItems.Remove(item);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ChecklistItem?>> GetChecklistItem(int id)
        {
            var item = await _context.ChecklistItems.FindAsync(id);
            if (item == null) return NotFound();

            return item;
        }

        [HttpGet("card/{cardId}")]
        public async Task<ActionResult<IEnumerable<ChecklistItem>>> GetChecklistItemsByCard(int cardId)
        {
            var items = await _context.ChecklistItems
                .Where(item => item.CardId == cardId)
                .ToListAsync();
            
            if (items == null || !items.Any())
            {
                return Ok(new List<ChecklistItem>());
            }
            
            return Ok(items);
        }
    }
}