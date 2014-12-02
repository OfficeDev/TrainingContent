using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using SPContactsList.Models;

namespace SPContactsList.Controllers
{
    public class SpContactController : Controller
    {
      [Authorize]
      public async Task<ActionResult> Index(int? pageIndex, int? pageSize, string contactId) {
        SpContactRepository repository = new SpContactRepository();

        if (Request.HttpMethod == "POST" && contactId != null) {
          await repository.Delete(contactId);
          return Redirect("/");
        }

        SpContactViewModel model = new SpContactViewModel();

        if (pageIndex == null) {
          model.PageIndex = 0;
        } else {
          model.PageIndex = (int)pageIndex;
        }

        if (pageSize == null) {
          model.PageSize = 10;
        } else {
          model.PageSize = (int)pageSize;
        }

        model.SpContacts = await repository.GetContacts(model.PageIndex, model.PageSize);

        return View(model);
      }

      [Authorize] 
      public async Task<ActionResult> Details(string contactId) {
        SpContactRepository repository = new SpContactRepository();

        SpContact task = await repository.GetTask(contactId);

        return View(task);
      }

      [Authorize]
      public async Task<ActionResult> Create(SpContact task) {
        SpContactRepository repository = new SpContactRepository();

        if (Request.HttpMethod == "POST") {
          await repository.CreateTask(task);
          return Redirect("/");
        } else {
          return View(task);
        }
      }

      [Authorize]
      public async Task<ActionResult> Edit(string Id, SpContact task) {
        SpContactRepository repository = new SpContactRepository();

        if (Request.HttpMethod == "POST") {
          await repository.UpdateTask(task);
          return Redirect("/");
        } else {
          task = await repository.GetTask(Id);
          return View(task);
        }
      }
    }
  }