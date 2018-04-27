using OpenGraph.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace OpenGraph.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index(string code)
        {
            try
            {

                if (code != null)
                    YammerRepository.SaveInCache("AuthorizationCode", code);

                if (code == null && YammerRepository.GetFromCache("AuthorizationCode") == null)
                    throw new UnauthorizedAccessException();
            }
            catch
            {
                //Redirect on error
                return Redirect(
                    String.Format("https://www.yammer.com/dialog/oauth?client_id={0}&redirect_uri={1}", 
                    YammerRepository.ClientId, YammerRepository.RedirectUri));
            }
            return View();
        }

        public async Task<ActionResult> Create(ActivityViewModel model)
        {
            ActivityEnvelope envelope = new ActivityEnvelope(model);

            if (Request.HttpMethod == "POST")
            {
                await YammerRepository.PostActivity(envelope);
                return Redirect("/");
            }
            else
            {
                return View(model);
            }
        }
       
    }
}