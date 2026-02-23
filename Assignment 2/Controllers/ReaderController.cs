using Microsoft.AspNetCore.Mvc;

namespace LMS.Controllers
{
    [ApiController]
    [Route("api/reader")]
    public class ReaderController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetAllReaders()
        {
            return Ok("Get all readers");
        }

        [HttpGet("{id}")]
        public IActionResult GetReaderById(int id)
        {
            return Ok("Get reader by id: " + id);
        }

        [HttpPost]
        public IActionResult CreateReader()
        {
            return Ok("Create new reader");
        }

        [HttpPut("{id}")]
        public IActionResult UpdateReader(int id)
        {
            return Ok("Update reader: " + id);
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteReader(int id)
        {
            return Ok("Delete reader: " + id);
        }
    }
}
