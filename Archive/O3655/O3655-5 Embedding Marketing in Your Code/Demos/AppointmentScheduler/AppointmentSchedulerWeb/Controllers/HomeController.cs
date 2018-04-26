using AppointmentSchedulerWeb.Filters;
using AppointmentSchedulerWeb.Models;
using Microsoft.SharePoint.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace AppointmentSchedulerWeb.Controllers
{
    public class HomeController : Controller
    {
        [SharePointContextFilter]
        [SharePointLicenseFilter]
        public ActionResult Index()
        {
            return View();
        }

        [SharePointContextFilter]
        public ActionResult TestLicense(TestLicenseData licenseData)
        {

            if (HttpContext.Request.HttpMethod == "POST")
            {
                var spContext = SharePointContextProvider.Current.GetSharePointContext(HttpContext);
                var userContext = spContext.CreateUserClientContextForSPHost();

                string token = LicenseHelper.GenerateTestToken(
                    licenseData.licenseType,
                    licenseData.productId,
                    licenseData.userLimit,
                    licenseData.expirationPeriod,
                    licenseData.CustomerId);

                LicenseHelper.ImportLicense(
                    userContext,
                    token,
                    Request.Url.AbsoluteUri.Substring(0, Request.Url.AbsoluteUri.LastIndexOf("/")) + "/Content/ImagesAppIcon.png",
                    "Contoso Appointment Scheduler",
                    "Microsoft Office Developer Team");

                return Redirect("/Home/Index?SPHostUrl=" + spContext.SPHostUrl);
            }
            else
            {
                TestLicenseData newLicenseData = new TestLicenseData();
                return View(newLicenseData);
            }
        }

        public ActionResult NoLicense()
        {
            return View();
        }
    }
}
