using System.Web.Mvc;


namespace QuickStartCalendarWebApp.Controllers
{
    public class ErrorController : Controller
    {
        public ViewResult Index()
        {
            return View("Error");
        }
       
    }
}