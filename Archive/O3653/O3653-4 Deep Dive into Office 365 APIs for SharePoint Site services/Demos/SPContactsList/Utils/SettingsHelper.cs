using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;

namespace SPContactsList.Utils {
  public class SettingsHelper {

    public static string ClientId {
      get { return ConfigurationManager.AppSettings["ida:ClientID"]; }
    }

    public static string ClientSecret {
      get { return ConfigurationManager.AppSettings["ida:Password"]; }
    }

    public static string AzureAdTenantId {
      get { return ConfigurationManager.AppSettings["ida:AadTenantId"]; }
    }

    public static string O365TenantId {
      get { return ConfigurationManager.AppSettings["ida:O365TenantId"]; }
    }

    public static string SharePointServiceResourceId {
      get { return string.Format("https://{0}.sharepoint.com", O365TenantId); }
    }
    public static string SharePointServiceEndpoint {
      get { return SharePointServiceResourceId; }
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