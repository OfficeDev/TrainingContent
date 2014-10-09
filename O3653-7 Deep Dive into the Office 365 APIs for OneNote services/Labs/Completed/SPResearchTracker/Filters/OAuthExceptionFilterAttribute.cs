using SPResearchTracker.Controllers;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http.Filters;

namespace SPResearchTracker.Filters
{
    /// <summary>
    /// This filter applies when the OAuth token is invalid
    /// It returns 401 Unauthorized along with the appropriate authorization URL
    /// </summary>
    public class OAuthExceptionFilterAttribute : ExceptionFilterAttribute
    {
        public override void OnException(HttpActionExecutedContext actionExecutedContext)
        {
            if (actionExecutedContext.Exception is UnauthorizedAccessException)
            {
                string resource = ConfigurationManager.AppSettings["ida:Resource"];
                string redirectUri = HttpContext.Current.Request.Url.GetLeftPart(UriPartial.Authority).ToString() + "/Home/SPA";
                string authorizationUrl = OAuthController.GetAuthorizationUrl(resource, new Uri(redirectUri));
                actionExecutedContext.Response = new HttpResponseMessage(HttpStatusCode.Unauthorized);
                System.Net.Http.Headers.AuthenticationHeaderValue realm = new System.Net.Http.Headers.AuthenticationHeaderValue("OAuth", "realm=\"" + authorizationUrl + "\"");
                actionExecutedContext.Response.Headers.WwwAuthenticate.Add(realm);
            }
        }
    }
}