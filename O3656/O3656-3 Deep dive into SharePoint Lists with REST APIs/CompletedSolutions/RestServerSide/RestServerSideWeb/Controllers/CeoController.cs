using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using RestServerSideWeb.Models;

namespace RestServerSideWeb.Controllers
{
    public class CeoController : Controller
    {
        public async Task<ActionResult> Index()
        {
            var spContext = SharePointContextProvider.Current.GetSharePointContext(HttpContext);

            SpChiefExecutiveViewModel model = new SpChiefExecutiveViewModel();

            SpChiefExecutiveRepository repository = new SpChiefExecutiveRepository(spContext);
            model.SpChiefExecutives = await repository.GetChiefExecutives();

            return View(model);
        }

        public async Task<ActionResult> AppintNewCeo()
        {
            var spContext = SharePointContextProvider.Current.GetSharePointContext(HttpContext);

            SpChiefExecutiveRepository repository = new SpChiefExecutiveRepository(spContext);

            await repository.AppointNewCeo();

            return Redirect("/?SPHostUrl=" + spContext.SPHostUrl);
        }

        public async Task<ActionResult> RemoveSampleCeo()
        {
            var spContext = SharePointContextProvider.Current.GetSharePointContext(HttpContext);

            SpChiefExecutiveRepository repository = new SpChiefExecutiveRepository(spContext);

            await repository.DeleteFirstPerson();

            return Redirect("/?SPHostUrl=" + spContext.SPHostUrl);
        }
    }
}