using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Office365Calendar.Models;
using System.Threading.Tasks;

namespace Office365Calendar.Controllers
{
    public class CalendarController : Controller
    {
        MyEventsRepository _repo = new MyEventsRepository();

        [Authorize]
        public async Task<ActionResult> Index(int? pageNumber)
        {
            // setup paging
            const int pageSize = 5;
            if (pageNumber == null)
                pageNumber = 1;

            List<MyEvent> events = null;
            events = await _repo.GetEvents((int)pageNumber - 1, pageSize);
            ViewBag.pageNumber = pageNumber;
            if(events != null)
                ViewBag.morePagesAvailable = events.Count < pageSize ? false : true;

            return View(events);
        }

        [Authorize]
        public async Task<ActionResult> Delete(string id)
        {
            if (id != null)
            {
                await _repo.DeleteEvent(id);
            }

            return Redirect("/Calendar");

        }

        [HttpGet]
        [Authorize]
        public async Task<ActionResult> Create()
        {
            var myEvent = new MyEvent
            {
                Start = DateTimeOffset.Now,
                End = DateTimeOffset.Now.AddDays(1)
            };

            return View(myEvent);
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult> Create(MyEvent myEvent)
        {

            await _repo.AddEvent(myEvent);
            return Redirect("/Calendar");
        }

        [Authorize]
        public async Task<ActionResult> Details(string id)
        {

            MyEvent myEvent = null;
            myEvent = await _repo.GetEvent(id);
            return View(myEvent);
        }

        [HttpGet]
        [Authorize]
        public async Task<ActionResult> Search()
        {
            return View();
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult> Search(string searchTerm)
        {
            var events = await _repo.Search(searchTerm);
            return View(events);
        }
    }
}