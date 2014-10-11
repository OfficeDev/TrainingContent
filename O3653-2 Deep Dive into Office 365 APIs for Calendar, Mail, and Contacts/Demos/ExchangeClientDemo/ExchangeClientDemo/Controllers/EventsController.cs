using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

using System.Threading.Tasks;
using Microsoft.Office365.Exchange;
using Microsoft.Office365.OAuth;

using ExchangeClientDemo.Models;

namespace ExchangeClientDemo.Controllers {
    public class EventsController : Controller {
        public async Task<ActionResult> Index() {

            List<ExchangeClientDemo.Models.MyEvent> events = null;
            try {
                MyEventsRepository repo = new MyEventsRepository();
                events = await repo.GetEvents();
            }
            catch (RedirectRequiredException x) {
                return Redirect(x.RedirectUri.ToString());
            }
            return View(events);

        }

        public async Task<ActionResult> Details(string id) {

            ExchangeClientDemo.Models.MyEvent myEvent = null;
            try {
                MyEventsRepository repo = new MyEventsRepository();
                myEvent = await repo.GetEvent(id);
            }
            catch (RedirectRequiredException x) {
                return Redirect(x.RedirectUri.ToString());
            }
            return View(myEvent);
        }

        public async Task<ActionResult> Delete(string id) {
            MyEventsRepository repo  = new MyEventsRepository();

            if (id != null) {
                await repo.DeleteEvent(id);
            }

            return Redirect("/Events");

        }

        public async Task<ActionResult> Create(ExchangeClientDemo.Models.MyEvent myEvent) {

            if (Request.HttpMethod == "POST") {
                MyEventsRepository repo = new MyEventsRepository();
                await repo.AddEvent(myEvent);
                return Redirect("/Events");
            }
            else {
                myEvent.Start = DateTimeOffset.Now;
                myEvent.End = DateTimeOffset.Now.AddDays(1);
                return View(myEvent);
            }
        }
    }
}