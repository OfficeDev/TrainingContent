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

        const string OneDriveRoot = "https://[tenant]-my.sharepoint.com/personal/[user name]";
        const string SharePointServiceRoot = "https://[tenant]-my.sharepoint.com";
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
            //REST APIs do not support skip or orderby
            //So pull everything
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
            //StringBuilder requestUri = new StringBuilder(OneDriveRoot)
            //    .Append("/_api/Files(")
            //    .Append(id)
            //    .Append(")");

            //HttpClient client = new HttpClient();
            //HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Post, requestUri.ToString());
            //request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/xml"));
            //request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", await GetAccessToken());
            //HttpResponseMessage response = await client.SendAsync(request);
            //return true;

            //Patching not supported
            throw new NotImplementedException();

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
            DiscoveryContext disco = await DiscoveryContext.CreateAsync();
            ResourceDiscoveryResult rdr = await disco.DiscoverResourceAsync(SharePointServiceRoot);

            string clientId = disco.AppIdentity.ClientId;
            string clientSecret = disco.AppIdentity.ClientSecret;
            string refreshToken = new SessionCache().Read("RefreshToken");
            ClientCredential creds = new ClientCredential(clientId, clientSecret);

            AuthenticationResult authResult =
                await disco.AuthenticationContext.AcquireTokenByRefreshTokenAsync(
                refreshToken, creds, SharePointServiceRoot);

            return authResult.AccessToken;
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