using AppointmentSchedulerWeb.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace AppointmentSchedulerWeb.Filters
{
    public class SharePointLicenseAuthorizationAttribute : AuthorizeAttribute
    {
        private readonly LicenseType[] _licenseTypes;
        private readonly bool _refreshCache;

        public SharePointLicenseAuthorizationAttribute(bool refreshCache = false, params LicenseType[] licenseTypes)
        {
            _licenseTypes = licenseTypes;
            _refreshCache = refreshCache;
        }

        public override void OnAuthorization(AuthorizationContext filterContext)
        {
            if (_refreshCache || SharePointLicenseProvider.Current == null)
            {
                SharePointLicenseProvider.NewProvider(filterContext.HttpContext);
            }

            if (_licenseTypes.Length == 0 || 
                SharePointLicenses.Current.licenseType == LicenseType.None ||
                !_licenseTypes.Contains(SharePointLicenses.Current.licenseType) ||
                (SharePointLicenses.Current.licenseType == LicenseType.Trial && !SharePointLicenses.Current.allowTestMode))
            {
                filterContext.Result = new ViewResult {
                    ViewName = "NoLicense", 
                    ViewData = new ViewDataDictionary(new TestLicenseData()) };
            }

        }
    }
}