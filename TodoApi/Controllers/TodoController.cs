using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TodoApi.Data;
using TodoApi.Models;

namespace TodoApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TodoController : ControllerBase
    {
        private readonly TodoDbContext _context;

        public TodoController(TodoDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Todo>>> GetTodos()
        {
            return await _context.Todos.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Todo>> GetTodo(int id)
        {
            var todo = await _context.Todos.FindAsync(id);
            if (todo == null)
            {
                return NotFound();
            }
            return todo;
        }

        public record CreateTodoRequest(string Title, bool IsCompleted, string Category);

        [HttpPost]
        public async Task<ActionResult<Todo>> CreateTodo([FromBody] CreateTodoRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (string.IsNullOrWhiteSpace(request.Title))
            {
                return BadRequest(new { error = "Title is required" });
            }

            if (string.IsNullOrWhiteSpace(request.Category))
            {
                return BadRequest(new { error = "Category is required" });
            }

            if (!Categories.DefaultCategories.Contains(request.Category))
            {
                return BadRequest(new { error = "Invalid category" });
            }

            try
            {
                var todo = new Todo
                {
                    Title = request.Title,
                    IsCompleted = request.IsCompleted,
                    Category = request.Category,
                    CreatedAt = DateTime.UtcNow
                };

                _context.Todos.Add(todo);
                await _context.SaveChangesAsync();
                return CreatedAtAction(nameof(GetTodo), new { id = todo.Id }, todo);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Failed to create todo", details = ex.Message });
            }
        }

        public record UpdateTodoRequest(string Title, bool IsCompleted, string Category);

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTodo(int id, [FromBody] UpdateTodoRequest request)
        {
            var todo = await _context.Todos.FindAsync(id);
            if (todo == null)
            {
                return NotFound();
            }

            if (string.IsNullOrWhiteSpace(request.Title))
            {
                return BadRequest(new { error = "Title is required" });
            }

            if (string.IsNullOrWhiteSpace(request.Category))
            {
                return BadRequest(new { error = "Category is required" });
            }

            if (!Categories.DefaultCategories.Contains(request.Category))
            {
                return BadRequest(new { error = "Invalid category" });
            }

            try
            {
                todo.Title = request.Title;
                todo.IsCompleted = request.IsCompleted;
                todo.Category = request.Category;

                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Failed to update todo", details = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTodo(int id)
        {
            var todo = await _context.Todos.FindAsync(id);
            if (todo == null)
            {
                return NotFound();
            }

            try
            {
                _context.Todos.Remove(todo);
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Failed to delete todo", details = ex.Message });
            }
        }

        private bool TodoExists(int id)
        {
            return _context.Todos.Any(e => e.Id == id);
        }
    }
}
