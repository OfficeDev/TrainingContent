using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using Microsoft.IdentityModel.Clients.ActiveDirectory;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Net.Http;
using System.Net.Http.Headers;
using Newtonsoft.Json;
using System.Configuration;
using System.Diagnostics;
using OneDriveWeb.Models.JsonHelpers;

namespace OneDriveWeb.Models
{
    public class FileRepository
    {
        private string GraphResourceUrl = "https://graph.microsoft.com/V1.0/";

        public static async Task<string> GetGraphAccessTokenAsync()
        {
            var AzureAdGraphResourceURL = "https://graph.microsoft.com/";
            var Authority = ConfigurationManager.AppSettings["ida:AADInstance"] + ConfigurationManager.AppSettings["ida:TenantId"];

            var signInUserId = ClaimsPrincipal.Current.FindFirst(ClaimTypes.NameIdentifier).Value;
            var userObjectId = ClaimsPrincipal.Current.FindFirst("http://schemas.microsoft.com/identity/claims/objectidentifier").Value;
            var clientCredential = new ClientCredential(ConfigurationManager.AppSettings["ida:ClientId"], ConfigurationManager.AppSettings["ida:ClientSecret"]);
            var userIdentifier = new UserIdentifier(userObjectId, UserIdentifierType.UniqueId);

            // create auth context
            AuthenticationContext authContext = new AuthenticationContext(Authority, new ADALTokenCache(signInUserId));
            var result = await authContext.AcquireTokenSilentAsync(AzureAdGraphResourceURL, clientCredential, userIdentifier);

            return result.AccessToken;
        }

        public async Task<IEnumerable<FolderItem>> GetMyFiles(int pageIndex, int pageSize)
        {
            // create the query for all file at the root
            var query = GraphResourceUrl + "me/drive/root/children";
            // issue request & get response
            string responseString = await GetJsonAsync(query);
            // convert them to JSON
            var folderContents = JsonConvert.DeserializeObject<FolderContents>(responseString);

            return folderContents.FolderItems.OrderBy(item => item.Name).Skip(pageIndex * pageSize).Take(pageSize);
        }

        public static async Task<string> GetJsonAsync(string url)
        {
            string accessToken = await GetGraphAccessTokenAsync();
            using (HttpClient client = new HttpClient())
            {
                client.DefaultRequestHeaders.Add("Accept", "application/json");
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

                using (var response = await client.GetAsync(url))
                {
                    if (response.IsSuccessStatusCode)
                        return await response.Content.ReadAsStringAsync();
                    return null;
                }
            }
        }

        public async Task<bool> DeleteFile(string id, string etag)
        {
            // create query request to delete file
            var query = GraphResourceUrl + "/me/drive/items/" + id;
            string accessToken = await GetGraphAccessTokenAsync();

            using (HttpClient client = new HttpClient())
            {
                client.DefaultRequestHeaders.Add("Accept", "application/json");

                client.DefaultRequestHeaders.IfMatch.Add(new EntityTagHeaderValue(etag));
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

                using (var response = await client.DeleteAsync(query))
                {
                    if (response.IsSuccessStatusCode)
                        return true;
                    else
                        Debug.WriteLine("DeleteMessage error: " + response.StatusCode);
                }
            }

            return false;
        }

        public async Task<FolderItem> UploadFile(System.IO.Stream filestream, string filename)
        {
            // create query request to delete file
            var query = GraphResourceUrl + "me/drive/root:/" + filename + ":/content";
            string accessToken = await GetGraphAccessTokenAsync();

            using (HttpClient client = new HttpClient())
            {
                client.DefaultRequestHeaders.Add("Accept", "application/json");
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

                using (var content = new StreamContent(filestream))
                {
                    content.Headers.Add("Content-Type", "text/plain");
                    using (var response = await client.PutAsync(query, content))
                    {
                        if (response.IsSuccessStatusCode)
                        {
                            return JsonConvert.DeserializeObject<FolderItem>(await response.Content.ReadAsStringAsync());
                        }
                        else
                        {
                            return null;
                        }
                    }
                }
            }
        }
    }
}