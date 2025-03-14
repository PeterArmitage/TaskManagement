using Microsoft.AspNetCore.Mvc;
using Backend.Models;
using Backend.Data;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ListsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ListsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/lists
        [HttpGet]
        public async Task<ActionResult<IEnumerable<List>>> GetLists()
        {
            return await _context.Lists
                .Include(l => l.Cards)
                .Select(l => new List
                {
                    Id = l.Id,
                    Name = l.Name,
                    BoardId = l.BoardId,
                    Cards = l.Cards
                })
                .ToListAsync();
        }

        // GET: api/lists/5
        [HttpGet("{id}")]
        public async Task<ActionResult<List>> GetList(int id)
        {
            var list = await _context.Lists
                .Include(l => l.Cards)
                .FirstOrDefaultAsync(l => l.Id == id);

            if (list == null)
            {
                return NotFound();
            }

            return list;
        }

        // POST: api/lists
        [HttpPost]
        public async Task<ActionResult<List>> CreateList([FromBody] List list)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var board = await _context.Boards.FindAsync(list.BoardId);
                if (board == null) return NotFound($"Board with ID {list.BoardId} not found");

                _context.Lists.Add(new List
                {
                    Name = list.Name,
                    BoardId = list.BoardId
                });
                
                await _context.SaveChangesAsync();
                return Ok(list);
            }
            catch (Exception ex)
            {
                // Log the exception
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // PUT: api/lists/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateList(int id, List list)
        {
            if (id != list.Id)
            {
                return BadRequest();
            }

            _context.Entry(list).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Lists.Any(l => l.Id == id))
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

        // DELETE: api/lists/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteList(int id)
        {
            var list = await _context.Lists.FindAsync(id);
            if (list == null)
            {
                return NotFound();
            }

            _context.Lists.Remove(list);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}