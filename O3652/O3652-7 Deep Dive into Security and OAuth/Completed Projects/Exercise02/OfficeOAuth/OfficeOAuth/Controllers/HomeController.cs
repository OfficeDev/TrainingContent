using Microsoft.Office365.Exchange;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace OfficeOAuth.Controllers
{
    public class HomeController : Controller
    {
        public async Task<ActionResult> Index()
        {
            IOrderedEnumerable<IEvent> events = await CalendarAPISample.GetCalendarEvents();
            ViewBag.Events = events;
            return View();
        }
    }
}
