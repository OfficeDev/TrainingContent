using Microsoft.IdentityModel.Clients.ActiveDirectory;
using Microsoft.Office365.OAuth;
using Microsoft.Office365.SharePoint;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Xml.Linq;

namespace Files.Models
{
    public class OneDriveRepository : IFileRepository
    {

        const string OneDriveRoot = "https://msacademy1-my.sharepoint.com/personal/scot_msacademy1_onmicrosoft_com";
        const string SharePointServiceRoot = "https://msacademy1-my.sharepoint.com";

        public const string ClientId = "0b700747-cf8c-44e7-aac5-f3b4d2d9aa94";

        public const string ClientSecret = "TjuyUMcMUlOPf4mNML1a82EBQ8GU3v0c+cxWC8iWrR4=";
        public static readonly string ClientSecretEncoded = HttpUtility.UrlEncode(ClientSecret);

        public const string DebugSiteUrl = "http://localhost:44781/";
        public const string DebugSiteRedirectUrl = "http://localhost:44781/Home/OAuth/";

        public const string AADAuthUrl = "https://login.windows.net/common/oauth2/authorize" +
                                          "?resource=" + SharePointServiceRoot +
                                          "&client_id=" + ClientId +
                                          "&redirect_uri=" + DebugSiteRedirectUrl +
                                          "&response_type=code";

        public const string AccessTokenRequesrUrl = "https://login.windows.net/common/oauth2/token" +
                                             "";

        public static string AccessTokenRequestBody = "grant_type=authorization_code" +
                                                       "&resource=" + SharePointServiceRoot +
                                                       "&redirect_uri=" + DebugSiteRedirectUrl +
                                                       "&client_id=" + ClientId +
                                                       "&client_secret=" + ClientSecretEncoded +
                                                       "&code=";



        public async Task<MyFile> UploadFile(Stream filestream, string filename)
        {
            StringBuilder requestUri = new StringBuilder(OneDriveRoot)
                .Append("/_api/Files/Add")
                .Append("(name='")
                .Append(filename)
                .Append("',overwrite=true)");

            HttpClient client = new HttpClient();
            HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Post, requestUri.ToString());
            request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/xml"));
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", await GetAccessToken());
            request.Content = new StreamContent(filestream);
            HttpResponseMessage response = await client.SendAsync(request);
            string responseString = await response.Content.ReadAsStringAsync();

            XElement root = XElement.Parse(responseString);
            XNamespace d = "http://schemas.microsoft.com/ado/2007/08/dataservices";
            XNamespace m = "http://schemas.microsoft.com/ado/2007/08/dataservices/metadata";

            List<MyFile> myFiles = new List<MyFile>();

            XElement propElement = root.Descendants(m + "properties").First();

            MyFile myFile = new MyFile();
            myFile.Id = propElement.Elements(d + "Id").First().Value;
            myFile.Name = propElement.Elements(d + "Name").First().Value;
            myFile.Url = propElement.Elements(d + "Url").First().Value;
            myFile.TimeCreated = DateTime.Parse(propElement.Elements(d + "TimeCreated").First().Value);
            myFile.TimeLastModified = DateTime.Parse(propElement.Elements(d + "TimeLastModified").First().Value);

            return myFile;
        }

        public async Task<List<MyFile>> GetMyFiles(int pageIndex, int pageSize)
        {
            StringBuilder requestUri = new StringBuilder(OneDriveRoot)
                .Append("/_api/Files")
                .Append("?$select=Id,Name,Url,TimeCreated,TimeLastModified");

            HttpClient client = new HttpClient();
            HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Get, requestUri.ToString());
            request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/xml"));
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", await GetAccessToken());
            HttpResponseMessage response = await client.SendAsync(request);
            string responseString = await response.Content.ReadAsStringAsync();


            XElement root = XElement.Parse(responseString);
            XNamespace d = "http://schemas.microsoft.com/ado/2007/08/dataservices";
            XNamespace m = "http://schemas.microsoft.com/ado/2007/08/dataservices/metadata";

            List<MyFile> myFiles = new List<MyFile>();

            foreach (XElement propElement in root.Descendants(m + "properties"))
            {

                MyFile myFile = new MyFile();
                myFile.Id = propElement.Elements(d + "Id").First().Value;
                myFile.Name = propElement.Elements(d + "Name").First().Value;
                myFile.Url = propElement.Elements(d + "Url").First().Value;
                myFile.TimeCreated = DateTime.Parse(propElement.Elements(d + "TimeCreated").First().Value);
                myFile.TimeLastModified = DateTime.Parse(propElement.Elements(d + "TimeLastModified").First().Value);
                myFiles.Add(myFile);
            }

            //Perform paging here using LINQ
            return myFiles.OrderBy(e => e.Name).Skip(pageIndex * pageSize).Take(pageSize).ToList();
        }

        public async Task<bool> RenameFile(string id, string filename)
        {
            StringBuilder requestUri = new StringBuilder(OneDriveRoot)
                .Append("/_api/Files(")
                .Append(id)
                .Append(")");

            HttpClient client = new HttpClient();
            HttpRequestMessage request = new HttpRequestMessage(new HttpMethod("PATCH"), requestUri.ToString());
            request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/xml"));
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", await GetAccessToken());
            HttpResponseMessage response = await client.SendAsync(request);
            return true;

        }

        public async Task<bool> DeleteFile(string id)
        {
            StringBuilder requestUri = new StringBuilder(OneDriveRoot)
                .Append("/_api/Files('")
                .Append(id)
                .Append("')");

            HttpClient client = new HttpClient();
            HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Delete, requestUri.ToString());
            request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/xml"));
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", await GetAccessToken());
            HttpResponseMessage response = await client.SendAsync(request);
            return true;
        }

        public Uri SignOut(string postLogoutRedirect)
        {
            throw new NotImplementedException();
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
                    client.BaseAddress = new Uri(AccessTokenRequesrUrl);

                    var content = new FormUrlEncodedContent(new[] {
                        new KeyValuePair<string, string>("grant_type", "authorization_code"),
                        new KeyValuePair<string, string>("resource", SharePointServiceRoot),
                        new KeyValuePair<string, string>("redirect_uri", DebugSiteRedirectUrl),
                        new KeyValuePair<string, string>("client_id", ClientId),
                        new KeyValuePair<string, string>("client_secret", ClientSecret),
                        new KeyValuePair<string, string>("code", System.Web.HttpContext.Current.Session["AuthCode"].ToString())
                    });

                    var result = await client.PostAsync(AccessTokenRequesrUrl, content);
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