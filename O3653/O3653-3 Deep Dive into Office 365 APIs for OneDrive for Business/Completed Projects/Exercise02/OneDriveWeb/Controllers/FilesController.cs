using OneDriveWeb.Models;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace OneDriveWeb.Controllers
{
    public class FilesController : Controller
    {
        // GET: Files
        [Authorize]
        public async Task<ActionResult> Index(int? pageIndex)
        {
            FileRepository repository = new FileRepository();

            const int pageSize = 10;

            if (pageIndex == null)
                pageIndex = 1;

            var files = await repository.GetMyFiles((int)pageIndex - 1, pageSize);
            ViewBag.pageIndex = pageIndex;
            ViewBag.morePagesAvailable = files.Count < pageSize ? false : true;
            return View(files);
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
        public async Task<ActionResult> Delete(string name)
        {
            FileRepository repository = new FileRepository();

            if (name != null)
            {
                await repository.DeleteFile(name);
            }

            return Redirect("/Files");

        }
    }
}