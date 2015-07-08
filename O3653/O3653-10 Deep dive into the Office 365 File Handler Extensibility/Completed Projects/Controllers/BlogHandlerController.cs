using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Security.Claims;
using System.ServiceModel.Syndication;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using System.Web.Profile;
using System.Xml;
using FileHandler.Models;
using FileHandler.Utils;
using Microsoft.IdentityModel.Clients.ActiveDirectory;

namespace FileHandler.Controllers {

  [Authorize]
  public class BlogHandlerController : Controller {
    
    private ActivationParameters LoadActivationParameters() {
      ActivationParameters parameters = new ActivationParameters(Request.Form);
      return parameters;
    }

    public async Task<ActionResult> Preview() {
      var signInUserId = ClaimsPrincipal.Current.FindFirst(ClaimTypes.NameIdentifier).Value;
      var userObjectId = ClaimsPrincipal.Current.FindFirst(SettingsHelper.ClaimTypeObjectIdentifier).Value;

      var clientCredential = new ClientCredential(SettingsHelper.ClientId, SettingsHelper.ClientSecret);
      var userIdentifier = new UserIdentifier(userObjectId, UserIdentifierType.UniqueId);

      string token = null;
      AuthenticationContext authContext = new AuthenticationContext(SettingsHelper.AzureADAuthority, new EFADALTokenCache(signInUserId));

      // get the activation parameters submitted from SharePoint
      ActivationParameters parameters = this.LoadActivationParameters();

      // get access token for unified api
      var authResult = await authContext.AcquireTokenSilentAsync(parameters.ResourceId, clientCredential, userIdentifier);
      token = authResult.AccessToken;

      // get contents of the file in SharePoint
      HttpWebRequest request = (HttpWebRequest)WebRequest.Create(parameters.FileGet);
      request.Headers.Add(HttpRequestHeader.Authorization, "Bearer " + token);
      Stream responseStream = request.GetResponse().GetResponseStream();
      StreamReader srReader= new StreamReader(responseStream);
      var fileContents = srReader.ReadToEnd();

      // read XML feed
      XmlReader xmlReader = XmlReader.Create(fileContents);
      SyndicationFeed feed = SyndicationFeed.Load(xmlReader);
      xmlReader.Close();

      ViewBag.FeedTitle = feed.Title.Text;
      ViewBag.Posts = feed.Items;
      return View();
    }

    public async Task<ActionResult> Open() {
      var signInUserId = ClaimsPrincipal.Current.FindFirst(ClaimTypes.NameIdentifier).Value;
      var userObjectId = ClaimsPrincipal.Current.FindFirst(SettingsHelper.ClaimTypeObjectIdentifier).Value;

      var clientCredential = new ClientCredential(SettingsHelper.ClientId, SettingsHelper.ClientSecret);
      var userIdentifier = new UserIdentifier(userObjectId, UserIdentifierType.UniqueId);

      string token = null;
      AuthenticationContext authContext = new AuthenticationContext(SettingsHelper.AzureADAuthority, new EFADALTokenCache(signInUserId));

      // get the activation parameters submitted from SharePoint
      ActivationParameters parameters = this.LoadActivationParameters();

      // get access token for unified api
      var authResult = await authContext.AcquireTokenSilentAsync(parameters.ResourceId, clientCredential, userIdentifier);
      token = authResult.AccessToken;

      // get contents of the file in SharePoint
      HttpWebRequest request = (HttpWebRequest)WebRequest.Create(parameters.FileGet);
      request.Headers.Add(HttpRequestHeader.Authorization, "Bearer " + token);
      Stream responseStream = request.GetResponse().GetResponseStream();
      StreamReader srReader = new StreamReader(responseStream);
      var fileContents = srReader.ReadToEnd();

      // read XML feed
      XmlReader xmlReader = XmlReader.Create(fileContents);
      SyndicationFeed feed = SyndicationFeed.Load(xmlReader);
      xmlReader.Close();

      ViewBag.FeedTitle = feed.Title.Text;
      ViewBag.Posts = feed.Items;
      return View();
    }

  }
}