using System.Web.Mvc;


namespace GraphUsersGroups.Controllers
{
    public class ErrorController : Controller
    {
        public ViewResult Index()
        {
            return View("Error");
        }
       
    }
}