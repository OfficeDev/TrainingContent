using Microsoft.Office365.OAuth;
using Microsoft.Office365.SharePoint;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace Files.Models
{
    public interface IFileRepository
    {
        Task<MyFile> UploadFile(Stream filestream, string filename);
        Task<List<MyFile>> GetMyFiles(int pageIndex, int pageSize);
        Task<bool> RenameFile(string id, string filename);
        Task<bool> DeleteFile(string id);

        Uri SignOut(string postLogoutRedirect);
    }
    public class FileRepository : IFileRepository
    {
        const string MyFilesCapability = "MyFiles";

        public async Task<MyFile> UploadFile(Stream filestream, string filename)
        {
            var client = await EnsureClientCreated();
            IFile file = await client.Files.AddAsync(filename, true, filestream);
            return new MyFile()
            {
                Id = file.Id,
                Name = file.Name,
                Url = file.Url,
                TimeCreated = file.TimeCreated,
                TimeLastModified = file.TimeLastModified
            };

        }
        public async Task<List<MyFile>> GetMyFiles(int pageIndex, int pageSize)
        {
            var client = await EnsureClientCreated();

            var filesResults = await client.Files.ExecuteAsync();
            var files = filesResults.CurrentPage.OrderBy(e => e.Name).Skip(pageIndex * pageSize).Take(pageSize);

            List<MyFile> myFiles = new List<MyFile>();
            foreach (var file in files)
            {
                myFiles.Add(new MyFile()
                {
                    Id = file.Id,
                    Name = file.Name,
                    Url = file.Url,
                    TimeCreated = file.TimeCreated,
                    TimeLastModified = file.TimeLastModified
                });
            }
            return myFiles;
        }

        public async Task<bool> RenameFile(string id, string filename)
        {
            //var client = await EnsureClientCreated();
            //IFileSystemItem fileSystemItem = await client.Files.GetByIdAsync(id);
            //fileSystemItem.Name = filename;
            //await fileSystemItem.UpdateAsync();
            //return true;

            //Patching not supported
            throw new NotImplementedException();

        }

        public async Task<bool> DeleteFile(string id)
        {
            var client = await EnsureClientCreated();
            IFileSystemItem fileSystemItem = await client.Files.GetByIdAsync(id);
            await fileSystemItem.DeleteAsync();
            return true;
        }
        private async Task<SharePointClient> EnsureClientCreated()
        {
            DiscoveryContext disco = GetFromCache("DiscoveryContext") as DiscoveryContext;

            if (disco == null)
            {
                disco = await DiscoveryContext.CreateAsync();
                SaveInCache("DiscoveryContext", disco);
            }

            var dcr = await disco.DiscoverCapabilityAsync(MyFilesCapability);

            var ServiceResourceId = dcr.ServiceResourceId;
            var ServiceEndpointUri = dcr.ServiceEndpointUri;
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

        public Uri SignOut(string postLogoutRedirect)
        {
            DiscoveryContext disco = GetFromCache("DiscoveryContext") as DiscoveryContext;

            if (disco == null)
            {
                disco = new DiscoveryContext();
            }

            disco.ClearCache();
            RemoveFromCache("DiscoveryContext");

            return disco.GetLogoutUri<SessionCache>(postLogoutRedirect);
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