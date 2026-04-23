using Bugatti.Models;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace Bugatti.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }

        /// <summary>Returns the count of frames in wwwroot/frames for dynamic JS config.</summary>
        [HttpGet("/api/frame-count")]
        public IActionResult FrameCount()
        {
            var framesPath = Path.Combine(
                Directory.GetCurrentDirectory(), "wwwroot", "frames");

            var count = Directory.Exists(framesPath)
                ? Directory.GetFiles(framesPath, "*.jpg").Length
                : 0;

            return Ok(new { count });
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel
            {
                RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier
            });
        }
    }
}
