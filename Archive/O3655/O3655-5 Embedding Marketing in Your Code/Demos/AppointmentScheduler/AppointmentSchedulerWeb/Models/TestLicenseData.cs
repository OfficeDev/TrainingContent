using AppointmentSchedulerWeb.Filters;
using System.Web.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel;

namespace AppointmentSchedulerWeb.Models
{
    public class TestLicenseData
    {
        [DisplayName("App Title")]
        public string appTitle { get; set; }
        [DisplayName("App Name")]
        public string appName { get; set; }
        [DisplayName("Product Id")]
        public string productId { get; set; }
        [DisplayName("Provider Name")]
        public string providerName { get; set; }
        [DisplayName("License Type")]
        public LicenseType licenseType { get; set; }
        [DisplayName("User Limit")]
        public UserLimit userLimit { get; set; }
        [DisplayName("Expiration Period")]
        public ExpirationPeriod expirationPeriod { get; set; }
        [DisplayName("Customer Id")]
        public string CustomerId { get; set; }

        public TestLicenseData()
        {
            appTitle = "Contoso Appointment Scheduler";
            appName = "ContosoAppointmentScheduler";
            productId = WebConfigurationManager.AppSettings["ProductId"];
            providerName = "Microsoft Office Developer Team";
            licenseType = LicenseType.Trial;
            userLimit = UserLimit.Ten;
            expirationPeriod = ExpirationPeriod.Month;
            CustomerId = "739835AE59FDE73E";

        }


    }
}