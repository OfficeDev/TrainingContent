using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

using System.Threading.Tasks;
using TasksWeb.Models;

namespace TasksWeb.Controllers {
  public class SpTaskController : Controller {
    [Authorize]
    public async Task<ActionResult> Index(int? pageIndex, int? pageSize, string taskId) {
      SpTaskRepository repository = new SpTaskRepository();

      if (Request.HttpMethod == "POST" && taskId != null)
      {
        await repository.Delete(taskId);
        return Redirect("/");
      }

      SpTaskViewModel model = new SpTaskViewModel();

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

      model.SpTasks = await repository.GetTasks(model.PageIndex, model.PageSize);

      return View(model);
    }

    [Authorize]
    public async Task<ActionResult> Details(string taskId) {
      SpTaskRepository repository = new SpTaskRepository();

      SpTask task = await repository.GetTask(taskId);

      return View(task);
    }

    [Authorize]
    public async Task<ActionResult> Create(SpTask task)
    {
      SpTaskRepository repository = new SpTaskRepository();

      if (Request.HttpMethod == "POST")
      {
        await repository.CreateTask(task);
        return Redirect("/");
      }
      else
      {
        return View(task);
      }
    }

    [Authorize]
    public async Task<ActionResult> Edit(string Id, SpTask task)
    {
      SpTaskRepository repository = new SpTaskRepository();

      if (Request.HttpMethod == "POST")
      {
        await repository.UpdateTask(task);
        return Redirect("/");
      }
      else
      {
        task = await repository.GetTask(Id);
        return View(task);
      }
    }
  }
}