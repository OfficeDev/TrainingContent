using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using OneDriveWeb.Models;

namespace OneDriveWeb.Controllers {
  public class OneDriveNewApiController : Controller {
    [Authorize]
    public async Task<ActionResult> Index(int? pageIndex, int? pageSize) {

      var repository = new OneDriveNewApiRepository();

      // setup paging defaults if not provided
      pageIndex = pageIndex ?? 0;
      pageSize = pageSize ?? 10;

      // setup paging for the IU
      ViewBag.PageIndex = (int)pageIndex;
      ViewBag.PageSize = (int)pageSize;

      var myFiles = await repository.GetMyFiles((int)pageIndex, (int)pageSize);

      return View(myFiles);
    }

    [Authorize]
    public async Task<ActionResult> Delete(string id, string etag) {
      var repository = new OneDriveNewApiRepository();

      if (id != null) {
        await repository.DeleteFile(id, etag);
      }

      return Redirect("/");
    }

  }
}