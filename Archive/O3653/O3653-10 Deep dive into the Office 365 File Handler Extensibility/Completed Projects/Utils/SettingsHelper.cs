using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;

namespace FileHandler.Utils {
  public class SettingsHelper {

    public static string ClientId {
      get { return ConfigurationManager.AppSettings["ida:ClientID"]; }
    }

    public static string ClientSecret {
      get { return ConfigurationManager.AppSettings["ida:Password"]; }
    }

    public static string AzureAdTenantId {
      get { return ConfigurationManager.AppSettings["ida:TenantId"]; }
    }

    public static string UnifiedApiServiceEndpoint {
      get { return "https://graph.microsoft.com/beta/"; }
    }

    public static string O365DiscoveryResourceId {
      get { return "https://graph.microsoft.com/"; }
    }

    public static string AzureAdGraphResourceId {
      get { return "https://graph.windows.net"; }
    }

    public static string AzureADAuthority {
      get { return string.Format("https://login.windows.net/{0}/", AzureAdTenantId); }
    }

    public static string ClaimTypeObjectIdentifier {
      get { return "http://schemas.microsoft.com/identity/claims/objectidentifier"; }
    }

    public static string ClaimTypeTenantId
    {
      get { return "http://schemas.microsoft.com/identity/claims/tenantid"; }
    }
  }
}