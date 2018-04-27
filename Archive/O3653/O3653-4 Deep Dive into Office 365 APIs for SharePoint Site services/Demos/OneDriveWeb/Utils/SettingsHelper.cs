using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;

namespace OneDriveWeb.Utils {
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

    public static string O365DiscoveryServiceEndpoint {
      get { return "https://api.office.com/discovery/v1.0/me/"; }
    }

    public static string O365DiscoveryResourceId {
      get { return "https://api.office.com/discovery/"; }
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
  }
}