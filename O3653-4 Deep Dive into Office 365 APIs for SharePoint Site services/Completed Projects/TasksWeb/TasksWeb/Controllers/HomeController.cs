using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Microsoft.Office365.OAuth;
using System.Threading.Tasks;
using TasksWeb.Models;

namespace TasksWeb.Controllers
{
    public class HomeController : Controller
    {
        public async Task<ActionResult> Index(int? pageIndex, int? pageSize, string taskId)
        {
            TaskRepository repository = new TaskRepository();

            if (Request.HttpMethod == "POST" && taskId != null)
            {
                await repository.DeleteTask(taskId);
                return Redirect("/");
            }

            TaskViewModel model = new TaskViewModel();

            if (pageIndex == null)
            {
                model.PageIndex = 0;
            }
            else
            {
                model.PageIndex = (int)pageIndex;
            }

            if (pageSize == null)
            {
                model.PageSize = 10;
            }
            else
            {
                model.PageSize = (int)pageSize;
            }

            try
            {
                model.Tasks = await repository.GetTasks(model.PageIndex, model.PageSize);
            }
            catch (RedirectRequiredException x)
            {
                return Redirect(x.RedirectUri.ToString());
            }

            return View(model);
        }

        public async Task<ActionResult> View(string taskId)
        {
            TaskRepository repository = new TaskRepository();

            TasksWeb.Models.Task contact = null;
            try
            {
                contact = await repository.GetTask(taskId);
            }
            catch (RedirectRequiredException x)
            {
                return Redirect(x.RedirectUri.ToString());
            }

            return View(contact);
        }

        public async Task<ActionResult> Create(TasksWeb.Models.Task task)
        {
            TaskRepository repository = new TaskRepository();

            if (Request.HttpMethod == "POST")
            {
                TasksWeb.Models.Task newTask = await repository.CreateTask(task);
                return Redirect("/");
            }
            else
            {
                return View(task);
            }
        }

        public async Task<ActionResult> Edit(string Id, TasksWeb.Models.Task task)
        {
            TaskRepository repository = new TaskRepository();

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
        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
    }
}