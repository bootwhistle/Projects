using Microsoft.AspNetCore.Mvc;

namespace LMS.Controllers
{
    [ApiController]
    [Route("api/book")]
    public class BookController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetAllBooks()
        {
            return Ok("Get all books");
        }

        [HttpGet("{id}")]
        public IActionResult GetBookById(int id)
        {
            return Ok("Get book by id: " + id);
        }

        [HttpPost]
        public IActionResult CreateBook()
        {
            return Ok("Create new book");
        }

        [HttpPut("{id}")]
        public IActionResult UpdateBook(int id)
        {
            return Ok("Update book: " + id);
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteBook(int id)
        {
            return Ok("Delete book: " + id);
        }
    }
}
