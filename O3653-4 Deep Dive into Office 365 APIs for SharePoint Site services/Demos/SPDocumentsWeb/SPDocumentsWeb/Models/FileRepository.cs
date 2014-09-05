using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.Office365.OAuth;
using Microsoft.Office365.SharePoint;
using System.IO;
using System.Threading.Tasks;

namespace SPDocumentsWeb
{
    public class FileRepository
    {
        const string ServiceResourceId = "https://[tenant].sharepoint.com";
        static readonly Uri ServiceEndpointUri = new Uri("https://[tenant].sharepoint.com/_api/");

        public async Task DeleteFile(string id)
        {
            var client = await EnsureClientCreated();
            IFileSystemItem fileSystemItem = await client.Files.GetByIdAsync(id);
            await fileSystemItem.DeleteAsync();
        }
        public async Task<IFile> UploadFile(Stream filestream, string filename)
        {
            var client = await EnsureClientCreated();
            return await client.Files.AddAsync(filename, true, filestream);

        }
        public async Task<IEnumerable<IFileSystemItem>> GetMyFiles(int pageIndex, int pageSize)
        {
            var client = await EnsureClientCreated();

            var filesResults = await client.Files.ExecuteAsync();
            return filesResults.CurrentPage.OrderBy(e => e.Name).Skip(pageIndex * pageSize).Take(pageSize);

        }
        private async Task<SharePointClient> EnsureClientCreated()
        {
            DiscoveryContext disco = GetFromCache("DiscoveryContext") as DiscoveryContext;

            if (disco == null)
            {
                disco = await DiscoveryContext.CreateAsync();
                SaveInCache("DiscoveryContext", disco);
            }

            var dcr = await disco.DiscoverResourceAsync(ServiceResourceId);

            SaveInCache("LastLoggedInUser", dcr.UserId);

            return new SharePointClient(ServiceEndpointUri, async () =>
            {
                return (await disco.AuthenticationContext.AcquireTokenByRefreshTokenAsync(
                    new SessionCache().Read("RefreshToken"),
                    new Microsoft.IdentityModel.Clients.ActiveDirectory.ClientCredential(
                        disco.AppIdentity.ClientId,
                        disco.AppIdentity.ClientSecret),
                        ServiceResourceId)).AccessToken;
            });
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