using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;

namespace ClientCredsAddin.Utils
{
    public class SettingsHelper
    {
        public static string ClientId
        {
            get { return ConfigurationManager.AppSettings["ida:ClientID"]; }
        }

        public static string ClientSecret
        {
            get { return ConfigurationManager.AppSettings["ida:ClientSecret"]; }
        }

        public static string RedirectUri
        {
            get { return ConfigurationManager.AppSettings["ida:RedirectUri"]; }
        }

        public static string AzureAdTenantId
        {
            get { return ConfigurationManager.AppSettings["ida:AADTenantId"]; }
        }

        public static string AzureAdDomain
        {
            get { return ConfigurationManager.AppSettings["ida:AADDomain"]; }
        }

        public static string AzureADAuthority
        {
            get { return string.Format("https://login.microsoftonline.com/{0}/", AzureAdTenantId); }
        }
    }
}