using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.Office365.OAuth;
using Microsoft.Office365.SharePoint;
using System.IO;
using System.Threading.Tasks;
using Microsoft.IdentityModel.Clients.ActiveDirectory;
using System.Net.Http;
using SPDocumentsWeb.Models;

namespace SPDocumentsWeb
{
    public class FileRepository
    {

        public const string ServiceResourceId = "https://msacademy1.sharepoint.com";
        static readonly Uri ServiceEndpointUri = new Uri("https://msacademy1.sharepoint.com/_api/");

        public const string ClientId = "414ad200-cbe6-4b7a-8b3e-132ad52bb50c";

        public const string ClientSecret = "W7L6Il0g1CgSofLOnLCaeM350v+hwHwSRAnyUeVPioE=";
        public static readonly string ClientSecretEncoded = HttpUtility.UrlEncode(ClientSecret);

        public const string DebugSiteUrl = "http://localhost:59188/";
        public const string DebugSiteRedirectUrl = "http://localhost:59188/Home/OAuth/";

        public const string AADAuthUrl = "https://login.windows.net/common/oauth2/authorize" +
                                          "?resource=" + ServiceResourceId +
                                          "&client_id=" + ClientId +
                                          "&redirect_uri=" + DebugSiteRedirectUrl +
                                          "&response_type=code";

        public const string AccessTokenRequesrUrl = "https://login.windows.net/common/oauth2/token" +
                                             "";

        public static string AccessTokenRequestBody = "grant_type=authorization_code" +
                                                       "&resource=" + ServiceResourceId +
                                                       "&redirect_uri=" + DebugSiteRedirectUrl +
                                                       "&client_id=" + ClientId +
                                                       "&client_secret=" + ClientSecretEncoded +
                                                       "&code=";


        public async Task DeleteFile(string id)
        {
            var client = new SharePointClient(ServiceEndpointUri, GetAccessToken);
            IFileSystemItem fileSystemItem = await client.Files.GetByIdAsync(id);
            await fileSystemItem.DeleteAsync();
        }
        public async Task<IFile> UploadFile(Stream filestream, string filename)
        {
            var client = new SharePointClient(ServiceEndpointUri, GetAccessToken);
            return await client.Files.AddAsync(filename, true, filestream);

        }
        public async Task<IEnumerable<IFileSystemItem>> GetMyFiles(int pageIndex, int pageSize)
        {
            var client = new SharePointClient(ServiceEndpointUri, GetAccessToken);
            var filesResults = await client.Files.ExecuteAsync();
            return filesResults.CurrentPage.OrderBy(e => e.Name).Skip(pageIndex * pageSize).Take(pageSize);

        }

        private async Task<string> GetAccessToken()
        {
            string accessToken = null;
            try
            {
                accessToken = System.Web.HttpContext.Current.Session["AccessToken"].ToString();
            }
            catch
            {
                accessToken = null;
            }

            if (accessToken == null)
            {
                try
                {
                    var client = new HttpClient();
                    client.BaseAddress = new Uri(FileRepository.AccessTokenRequesrUrl);

                    var content = new FormUrlEncodedContent(new[] {
                        new KeyValuePair<string, string>("grant_type", "authorization_code"),
                        new KeyValuePair<string, string>("resource", FileRepository.ServiceResourceId),
                        new KeyValuePair<string, string>("redirect_uri", FileRepository.DebugSiteRedirectUrl),
                        new KeyValuePair<string, string>("client_id", FileRepository.ClientId),
                        new KeyValuePair<string, string>("client_secret", FileRepository.ClientSecret),
                        new KeyValuePair<string, string>("code", System.Web.HttpContext.Current.Session["AuthCode"].ToString())
                    });

                    var result = await client.PostAsync(FileRepository.AccessTokenRequesrUrl, content);
                    JsonWebToken jwt = JsonWebToken.Deserialize(result.Content.ReadAsStringAsync().Result);
                    accessToken = jwt.access_token;
                    System.Web.HttpContext.Current.Session["AccessToken"] = accessToken;
                    ;
                }
                catch
                {
                    throw new RedirectRequiredException(new Uri(AADAuthUrl));
                }

            }
            return accessToken;

        }
        private void SaveInCache(string name, object value)
        {
            System.Web.HttpContext.Current.Session[name] = value;
        }

        private object GetFromCache(string name)
        {
            return System.Web.HttpContext.Current.Session[name];
        }

        private void RemoveFromCache(string name)
        {
            System.Web.HttpContext.Current.Session.Remove(name);
        }
    }
}