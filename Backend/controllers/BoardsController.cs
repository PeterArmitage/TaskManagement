using Microsoft.AspNetCore.Mvc;
using Backend.Models;
using Backend.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class BoardsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public BoardsController(AppDbContext context)
        {
            _context = context;
        }
        
        // Helper method to get the current user ID
        private int GetUserId()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return userId != null ? int.Parse(userId) : 0;
        }

        // GET: api/boards
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Board>>> GetBoards()
        {
            int userId = GetUserId();
            
            return await _context.Boards
                .Where(b => b.UserId == userId)
                .Include(b => b.Lists)
                    .ThenInclude(l => l.Cards)
                .AsSplitQuery()
                .ToListAsync();
        }

        // GET: api/boards/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Board>> GetBoard(int id)
        {
            int userId = GetUserId();
            
            var board = await _context.Boards
                .Include(b => b.Lists)
                .ThenInclude(l => l.Cards)
                .FirstOrDefaultAsync(b => b.Id == id && b.UserId == userId);

            if (board == null)
            {
                return NotFound();
            }

            return board;
        }

        // POST: api/boards
        [HttpPost]
        public async Task<ActionResult<Board>> CreateBoard(Board board)
        {
            int userId = GetUserId();
            board.UserId = userId;
            
            _context.Boards.Add(board);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetBoard), new { id = board.Id }, board);
        }

        // PUT: api/boards/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBoard(int id, Board board)
        {
            int userId = GetUserId();
            
            if (id != board.Id)
            {
                return BadRequest();
            }
            
            // Check if the board belongs to the current user
            var existingBoard = await _context.Boards.FindAsync(id);
            if (existingBoard == null || existingBoard.UserId != userId)
            {
                return NotFound();
            }
            
            // Ensure user doesn't change the UserId
            board.UserId = userId;
            
            _context.Entry(existingBoard).State = EntityState.Detached;
            _context.Entry(board).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Boards.Any(b => b.Id == id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/boards/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBoard(int id)
        {
            int userId = GetUserId();
            
            var board = await _context.Boards.FindAsync(id);
            if (board == null || board.UserId != userId)
            {
                return NotFound();
            }

            _context.Boards.Remove(board);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}