using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using OneDriveWeb.Models;

namespace OneDriveWeb.Controllers {
  public class FilesController : Controller {
    [Authorize]
    public async Task<ActionResult> Index(int? pageIndex, int? pageSize) {

      FileRepository repository = new FileRepository();

      // setup paging defaults if not provided
      pageIndex = pageIndex ?? 0;
      pageSize = pageSize ?? 10;

      // setup paging for the IU
      ViewBag.PageIndex = (int)pageIndex;
      ViewBag.PageSize = (int)pageSize;

      var myFiles = await repository.GetMyFiles((int)pageIndex, (int)pageSize);
      var results = myFiles.OrderBy(f => f.Name);

      return View(results);
    }

    [Authorize]
    public async Task<ActionResult> Upload() {

      FileRepository repository = new FileRepository();

      foreach (string key in Request.Files) {
        if (Request.Files[key] != null && Request.Files[key].ContentLength > 0) {
          var file = await repository.UploadFile(
              Request.Files[key].InputStream,
              Request.Files[key].FileName.Split('\\')[Request.Files[key].FileName.Split('\\').Length - 1]);
        }
      }

      return Redirect("/");
    }

    [Authorize]
    public async Task<ActionResult> Delete(string name) {
      FileRepository repository = new FileRepository();

      if (name != null) {
        await repository.DeleteFile(name);
      }

      return Redirect("/");

    }
  }
}