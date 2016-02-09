using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Office365PlannerTask.Models;
using System.Threading.Tasks;

namespace Office365PlannerTask.Controllers
{
    public class PlanController : Controller
    {
        MyPlansRepository _repo = new MyPlansRepository();
        [Authorize]
        public async Task<ActionResult> Index()
        {
            List<MyPlan> plans = null;
            plans = await _repo.GetPlans();

            return View(plans);
        }

        [HttpGet]
        [Authorize]
        public async Task<ActionResult> Create()
        {
            var myPlan = new MyPlan();
            return View(myPlan);
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult> Create(MyPlan myPlan)
        {

            await _repo.CreatePlan(myPlan);
            return Redirect("/Plan");
        }

        [HttpGet]
        [Authorize]
        public async Task<ActionResult> Update(string id)
        {
            MyPlan myPlan = await _repo.GetPlan(id);

            return View(myPlan);
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult> Update(MyPlan myPlan)
        {

            await _repo.UpdatePlan(myPlan);
            return Redirect("/Plan");
        }

        [Authorize]
        public async Task<ActionResult> Details(string id)
        {
            MyPlan myPlan = null;
            myPlan = await _repo.GetPlan(id);
            return View(myPlan);
        }
    }
}