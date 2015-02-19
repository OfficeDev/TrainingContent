using System;
using System.Configuration;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using AppointmentSchedulerWeb.LicenseVerificationService;

namespace AppointmentSchedulerWeb.Filters
{
    public class SharePointLicenses : SharePointLicenseProvider
    {
        public LicenseType licenseType { get; set; }
        public VerifyEntitlementTokenResponse license { get; set; }
        public int remainingDays { get; set; }
        public bool allowTestMode { get; set; }

        public SharePointLicenses(HttpContextBase httpContext)
        {
            licenseType = LicenseType.None;
            license = null;
            remainingDays = 0;
#if DEBUG
            allowTestMode = true;
#else
            allowTestMode = false;
#endif

            var spContext = SharePointContextProvider.Current.GetSharePointContext(httpContext);

            Guid ProductId = new Guid(ConfigurationManager.AppSettings["ProductId"]);
            var appContext = spContext.CreateUserClientContextForSPHost();
            license = LicenseHelper.GetAndVerifyLicense(ProductId, appContext);
            
            if (license != null)
            {
                switch (license.EntitlementType.ToUpper())
                {
                    case "FREE":
                        licenseType = LicenseType.Free;
                        remainingDays = int.MaxValue;
                        break;
                    case "PAID":
                        licenseType = LicenseType.Paid;
                        remainingDays = int.MaxValue;
                        break;
                    case "TRIAL":
                        licenseType = LicenseType.Trial;
                        DateTime licenseExpirationDate = (DateTime)license.EntitlementExpiryDate;
                        remainingDays = licenseExpirationDate == DateTime.MaxValue ? int.MaxValue : licenseExpirationDate.Subtract(DateTime.UtcNow).Days;
                        break;
                    default:
                        licenseType = LicenseType.None;
                        remainingDays = 0;
                        break;
                }

                if (license.IsTest && !allowTestMode)
                {
                    licenseType = LicenseType.None;
                    remainingDays = 0;
                }

            }
        }
    }

    public abstract class SharePointLicenseProvider
    {
        private static SharePointLicenseProvider current;

        public static SharePointLicenses Current
        {
            get { return SharePointLicenseProvider.current as SharePointLicenses; }
        }

        public static SharePointLicenseProvider NewProvider(HttpContextBase httpContext)
        {
            SharePointLicenseProvider.current = new SharePointLicenses(httpContext);
            return SharePointLicenseProvider.current;
        }
    }
}