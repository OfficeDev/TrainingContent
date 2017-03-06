using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Office365PlannerTask.Models;
using System.Threading.Tasks;

namespace Office365PlannerTask.Controllers
{
    public class TaskController : Controller
    {
        MyTasksRepository _repo = new MyTasksRepository();
        [Authorize]
        public async Task<ActionResult> Index(string planid)
        {
            List<MyTask> tasks = null;
            tasks = await _repo.GetTasks(planid);

            return View(tasks);
        }

        [HttpGet]
        [Authorize]
        public async Task<ActionResult> Create(string planid)
        {
            var myTask = new MyTask
            {
                planId = planid
            };

            return View(myTask);
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult> Create(MyTask myTask)
        {

            await _repo.CreateTask(myTask);
            return Redirect("/Task/Index?planid=" + myTask.planId);
        }

        [HttpGet]
        [Authorize]
        public async Task<ActionResult> Update(string id)
        {
            MyTask myTask = await _repo.GetTask(id);

            return View(myTask);
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult> Update(MyTask myTask)
        {

            await _repo.UpdateTask(myTask);
            return Redirect("/Task/Index?planid=" + myTask.planId);
        }

        [Authorize]
        public async Task<ActionResult> Delete(string id, string eTag, string planid)
        {
            if (id != null)
            {
                await _repo.DeleteTask(id, eTag);
            }

            return Redirect("/Task/Index?planid=" + planid);
        }

        [Authorize]
        public async Task<ActionResult> Details(string id)
        {
            MyTask myTask = null;
            myTask = await _repo.GetTask(id);
            return View(myTask);
        }
    }
}