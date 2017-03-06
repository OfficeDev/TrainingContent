using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.SharePoint.Client;

public class SharePointSiteManager {

  static public Dictionary<string, string> GetSiteProperties(ClientContext clientContext) {
    
    Web site = clientContext.Web;
    clientContext.Load(site);
    clientContext.ExecuteQuery();

    Dictionary<string, string> siteProperties = new Dictionary<string, string>();

    siteProperties.Add("Site URL", site.Url);
    siteProperties.Add("Site Title", site.Title);
    siteProperties.Add("Site ID", site.Id.ToString().ToLower());
    siteProperties.Add("Site Language", site.Language.ToString());
    siteProperties.Add("Server Relative Url", site.ServerRelativeUrl);
    siteProperties.Add("Master Page URL", site.MasterUrl);

    return siteProperties;

  }
}
