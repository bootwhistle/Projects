using Microsoft.AspNetCore.Mvc;

namespace LMS.Controllers
{
    [ApiController]
    [Route("api/borrowing")]
    public class BorrowingController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetAllBorrowings()
        {
            return Ok("Get all borrowings");
        }

        [HttpGet("{id}")]
        public IActionResult GetBorrowingById(int id)
        {
            return Ok("Get borrowing by id: " + id);
        }

        [HttpPost]
        public IActionResult CreateBorrowing()
        {
            return Ok("Create new borrowing");
        }

        [HttpPut("{id}")]
        public IActionResult UpdateBorrowing(int id)
        {
            return Ok("Update borrowing: " + id);
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteBorrowing(int id)
        {
            return Ok("Delete borrowing: " + id);
        }
    }
}
