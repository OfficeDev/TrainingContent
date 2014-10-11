using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AuthFlowDemo
{
    public class DemoConstants
    {
        public const string ClientId = "ff67bd93-a6e8-4695-b061-1e845c24b098";

        public const string ClientSecret = "6n0bVrK5pmoWy/472Qcxt/c7qWa8fJJcCn9i241M6ow=";
        public static readonly string ClientSecretEncoded = HttpUtility.UrlEncode(ClientSecret);

        public const string DebugSiteUrl = "http://localhost:1332/";
        public const string DebugSiteRedirectUrl = "http://localhost:1332/AcceptRedirect/";

        public const string AADAuthUrl = "https://login.windows.net/common/oauth2/authorize" + 
                                          "?resource=Microsoft.SharePoint" +
                                          "&client_id=" + ClientId +
                                          "&redirect_uri=" + DebugSiteRedirectUrl +
                                          "&response_type=code";

        public const string AccessTokenRequesrUrl = "https://login.windows.net/common/oauth2/token" + 
                                             "";

        public static string AccessTokenRequestBody  = "grant_type=authorization_code" + 
                                                       "&resource=https://outlook.office365.com" +
                                                       "&redirect_uri=" + DebugSiteRedirectUrl + 
                                                       "&client_id=" + ClientId +  
                                                       "&client_secret=" + ClientSecretEncoded +  
                                                       "&code=";

    }
}