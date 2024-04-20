using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.Extensions.Hosting;
using Org.BouncyCastle.Bcpg;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using MyCompanyName.AbpZeroTemplate.Dto;
using MyCompanyName.AbpZeroTemplate.Documents.Dto;

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

        // Download

        [HttpGet("DownloadFile")]

        public async Task<IActionResult> Download([FromQuery] string filename)
        {
            var uploads = Path.Combine(_env.ContentRootPath, "Files");
            var filePath = Path.Combine(uploads, filename);

            if (!System.IO.File.Exists(filePath))
            {
                return NotFound();
            }

            var memory = new MemoryStream();
            await using (var stream = new FileStream(filePath, FileMode.Open))
            {
                await stream.CopyToAsync(memory);
            }
            memory.Position = 0;

            return File(memory, GetContentType(filePath), filePath);
        }
        // End Download

        // Get Files
        [HttpGet("GetFiles")]
        public IActionResult Files()
        {
            var result = new List <string>();

            var uploads = Path.Combine(_env.ContentRootPath, "Files");

            if (Directory.Exists(uploads))
            {
                var provider = _env.ContentRootFileProvider;
                foreach (string fileName in Directory.GetFiles(uploads))
                {
                    var fileInfo = provider.GetFileInfo(fileName);
                    result.Add(fileInfo.Name);
                }
            }
            return Ok(result);
        }
        // End Get Files

        // Get Type 
        private string GetContentType(string path)
        {
            var provider = new FileExtensionContentTypeProvider();
            string contentType;

            if (!provider.TryGetContentType(path, out contentType))
            {
                contentType = "application/octet-stream";
            }

            return contentType;
        }
        // End Get Type
    }
}
