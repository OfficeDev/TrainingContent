using Microsoft.Office365.Exchange;
using System.Threading.Tasks;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Exercise2.Controllers
{
    public class HomeController : Controller
    {
        public async Task<ActionResult> Index()
        {
            IOrderedEnumerable<IEvent> events = await CalendarAPISample.GetCalendarEvents();
            ViewBag.Events = events;
            return View();
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