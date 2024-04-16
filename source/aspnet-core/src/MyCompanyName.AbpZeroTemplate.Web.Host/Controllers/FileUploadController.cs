using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting;
using Org.BouncyCastle.Bcpg;
using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace MyCompanyName.AbpZeroTemplate.Web.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FileUploadController : AbpZeroTemplateControllerBase
    {
        private readonly IHostEnvironment _env;
        public FileUploadController(IHostEnvironment env)
        {
            _env = env;
        }

        [HttpPost("Demo")]
        public async Task<string> UploadFileDemo(IFormFile formfile)
        {
            var dir = Path.Combine(_env.ContentRootPath, "Files");
            if (!Directory.Exists(dir))
            {
                Directory.CreateDirectory(dir);
            }

            var filePath = Path.Combine(dir, formfile.FileName);
            await formfile.CopyToAsync(new FileStream(filePath, FileMode.Create));
            return "pass";
        }

        [HttpPost("UploadFile")]
        public async Task <IActionResult> UploadFile()
        {
            var file = Request.Form.Files[0];
            /*var userName = Request.Form["userName"];*/
            var dir = Path.Combine(_env.ContentRootPath, "Files");
            if (!Directory.Exists(dir))
            {
                Directory.CreateDirectory(dir);
            }
            var filePath = Path.Combine(dir, file.FileName);
            await file.CopyToAsync(new FileStream(filePath, FileMode.Create));
            return Ok();
        }

    }
}
