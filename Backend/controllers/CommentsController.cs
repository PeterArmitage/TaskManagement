using Microsoft.AspNetCore.Mvc;
using Backend.Models;
using Backend.Data;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CommentsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CommentsController(AppDbContext context)
        {
            _context = context;
        }

        // POST: api/comments
        [HttpPost]
        public async Task<ActionResult<Comment>> PostComment([FromBody] Comment comment)
        {
            if (comment == null || string.IsNullOrEmpty(comment.Content))
            {
                return BadRequest("Comment content is required");
            }

            try
            {
                // Ensure the card exists
                var card = await _context.Cards.FindAsync(comment.CardId);
                if (card == null)
                {
                    return NotFound($"Card with ID {comment.CardId} not found");
                }

                _context.Comments.Add(comment);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetComment), new { id = comment.Id }, comment);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: api/comments/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Comment>> GetComment(int id)
        {
            var comment = await _context.Comments.FindAsync(id);

            if (comment == null)
            {
                return NotFound();
            }

            return comment;
        }

        // GET: api/comments/card/5
        [HttpGet("card/{cardId}")]
        public async Task<ActionResult<IEnumerable<Comment>>> GetCommentsForCard(int cardId)
        {
            return await _context.Comments
                .Where(c => c.CardId == cardId)
                .OrderByDescending(c => c.CreatedAt)
                .ToListAsync();
        }

        // PUT: api/comments/5
        [HttpPut("{id}")]
        public async Task<ActionResult<Comment>> UpdateComment(int id, [FromBody] Comment comment)
        {
            if (id != comment.Id)
            {
                return BadRequest("ID mismatch");
            }

            var existingComment = await _context.Comments.FindAsync(id);
            if (existingComment == null)
            {
                return NotFound();
            }

            existingComment.Content = comment.Content;
            existingComment.CardId = comment.CardId;

            try
            {
                await _context.SaveChangesAsync();
                return Ok(existingComment);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}