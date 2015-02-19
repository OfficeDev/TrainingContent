using AppointmentSchedulerWeb.Filters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace AppointmentSchedulerWeb.Controllers
{
    public class SchedulerController : Controller
    {
        [SharePointContextFilter]
        [SharePointLicenseAuthorization(true, LicenseType.Free, LicenseType.Paid, LicenseType.Trial)]
        public ActionResult Index()
        {
            var spContext = SharePointContextProvider.Current.GetSharePointContext(HttpContext);

            if (SharePointLicenseProvider.Current.licenseType == LicenseType.Trial)
            {
                ViewBag.Status = "Trial";
                ViewBag.DaysRemaining = SharePointLicenseProvider.Current.remainingDays;
                ViewBag.StoreFront = LicenseHelper.GetStorefrontUrl(
                    SharePointLicenseProvider.Current.license, 
                    spContext.SPHostUrl.ToString(), 
                    HttpContext.Request.Url.ToString(), 
                    "ContosoAppointmentScheduler");
            }
            else
            {
                ViewBag.Status = "Full";
            }
            return View();
        }
    }
}