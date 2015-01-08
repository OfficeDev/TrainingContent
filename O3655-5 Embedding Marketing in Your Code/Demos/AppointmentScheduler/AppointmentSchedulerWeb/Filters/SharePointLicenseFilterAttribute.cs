using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace AppointmentSchedulerWeb.Filters
{
    public class SharePointLicenseFilterAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            if (filterContext == null)
            {
                throw new ArgumentNullException("filterContext");
            }

            if (SharePointLicenseProvider.Current == null)
            {
                SharePointLicenseProvider.NewProvider(filterContext.HttpContext);
            }

        }
    }
}