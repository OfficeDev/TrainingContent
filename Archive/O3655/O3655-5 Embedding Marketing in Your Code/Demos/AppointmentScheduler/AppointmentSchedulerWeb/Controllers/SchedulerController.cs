using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using AppointmentSchedulerWeb.Filters;

namespace AppointmentSchedulerWeb.Controllers
{
	

	public class SchedulerController : Controller
    {
        [SharePointContextFilter]
        [SharePointLicenseAuthorization(true, LicenseType.Free, LicenseType.Paid, LicenseType.Trial)]
        public ActionResult Index()
        {
            var spContext = SharePointContextProvider.Current.GetSharePointContext(HttpContext);
			Guid appProductId = new Guid(ConfigurationManager.AppSettings["ProductId"]);

            if (SharePointLicenseProvider.Current.licenseType == LicenseType.Trial)
            {
                ViewBag.Status = "Trial";
                ViewBag.DaysRemaining = SharePointLicenseProvider.Current.remainingDays;
                ViewBag.ReviewPage = LicenseHelper.GetReviewURL(appProductId);
                ViewBag.StoreFront = LicenseHelper.GetStorefrontUrl(
                    SharePointLicenseProvider.Current.license, 
                    spContext.SPHostUrl.ToString(), 
                    HttpContext.Request.Url.ToString(), 
                    "ContosoAppointmentScheduler");
            }
            else
            {
                ViewBag.Status = "Full";
				ViewBag.ReviewPage = LicenseHelper.GetReviewURL(appProductId);
				ViewBag.StoreFront = LicenseHelper.GetStorefrontUrl(
					SharePointLicenseProvider.Current.license,
					spContext.SPHostUrl.ToString(),
					HttpContext.Request.Url.ToString(),
					"ContosoAppointmentScheduler");
            }
            return View();
        }
    }
}