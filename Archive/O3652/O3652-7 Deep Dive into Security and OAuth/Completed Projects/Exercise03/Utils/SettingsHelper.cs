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

        public static string Office365TenantId
        {
            get { return ConfigurationManager.AppSettings["ida:O365TenantId"]; }
        }

        public static string AzureAdTenantId
        {
            get { return ConfigurationManager.AppSettings["ida:TenantId"]; }
        }

        public static string CertPfxFilePath
        {
            get { return ConfigurationManager.AppSettings["ida:CertPfxFilePath"]; }
        }

        public static string CertPfxFilePassword
        {
            get { return ConfigurationManager.AppSettings["ida:CertPfxFilePassword"]; }
        }

        public static string AzureAdDomain
        {
            get { return ConfigurationManager.AppSettings["ida:Domain"]; }
        }

        public static string GraphResourceId
        {
            get { return "https://graph.microsoft.com/"; }
        }

        public static string AzureADAuthority
        {
            get { return string.Format("https://login.windows.net/{0}/", AzureAdTenantId); }
        }

        public static string ClaimTypeObjectIdentifier
        {
            get { return "http://schemas.microsoft.com/identity/claims/objectidentifier"; }
        }
    }
}