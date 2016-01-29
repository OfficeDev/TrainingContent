using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

using OneDriveWeb.Models;
using System.Threading.Tasks;
using OneDriveWeb.Models.JsonHelpers;

namespace OneDriveWeb.Controllers
{
    public class FilesController : Controller
    {
        // GET: Files
        [Authorize]
        public async Task<ActionResult> Index(int? pageIndex, int? pageSize)
        {

            FileRepository repository = new FileRepository();

            // setup paging defaults if not provided
            pageIndex = pageIndex ?? 0;
            pageSize = pageSize ?? 10;

            // setup paging for the IU
            ViewBag.PageIndex = (int)pageIndex;
            ViewBag.PageSize = (int)pageSize;

            var results = await repository.GetMyFiles((int)pageIndex, (int)pageSize);

            return View(results);
        }

        [Authorize]
        public async Task<ActionResult> Upload()
        {

            FileRepository repository = new FileRepository();

            foreach (string key in Request.Files)
            {
                if (Request.Files[key] != null && Request.Files[key].ContentLength > 0)
                {
                    var file = await repository.UploadFile(
                        Request.Files[key].InputStream,
                        Request.Files[key].FileName.Split('\\')[Request.Files[key].FileName.Split('\\').Length - 1]);
                }
            }

            return Redirect("/Files");
        }

        [Authorize]
        public async Task<ActionResult> Delete(string name, string etag)
        {
            FileRepository repository = new FileRepository();

            if (name != null)
            {
                await repository.DeleteFile(name, etag);
            }

            return Redirect("/Files");

        }
    }
}