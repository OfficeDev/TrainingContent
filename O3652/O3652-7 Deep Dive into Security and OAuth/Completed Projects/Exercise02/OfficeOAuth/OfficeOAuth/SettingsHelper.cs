using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Configuration;

namespace OfficeOAuth
{
    public static class SettingsHelper
    {
        public static string ClientID
        {
            get { return ConfigurationManager.AppSettings["ida:ClientID"]; }
        }

        public static string ClientSecret
        {
            get { return ConfigurationManager.AppSettings["ida:ClientSecret"]; }
        }

        public static string AADInstance
        {
            get { return ConfigurationManager.AppSettings["ida:AADInstance"]; }
        }

        public static string TenantId
        {
            get { return ConfigurationManager.AppSettings["ida:TenantId"]; }
        }

        public static string Authority
        {
            get { return AADInstance + TenantId; }
        }
    }
}
