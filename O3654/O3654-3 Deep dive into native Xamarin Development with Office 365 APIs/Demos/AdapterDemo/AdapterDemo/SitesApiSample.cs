using Android.Content;
using Microsoft.Office365.OAuth;
using Microsoft.Office365.SharePoint;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdapterDemo
{
    static class  SitesApiSample
    {
        //TODO: Replace with your SharePoint Site Name
        const string SharePointResourceId = "https://<tenant>.sharepoint.com";
        const string SharePointServiceRoot = "https://<tenant>.sharepoint.com/_api/";

        public static async Task<IEnumerable<IFileSystemItem>> GetDefaultDocumentFiles(Context context)
        {
            var client = await EnsureClientCreated(context);

            // Obtain files in default SharePoint folder
            var filesResults = await client.Files.ExecuteAsync();
            var files = filesResults.CurrentPage.OrderBy(e => e.Name);
            return files;
        }
    
        public static async Task<SharePointClient> EnsureClientCreated(Context context)
        {
            Authenticator authenticator = new Authenticator(context);
            var authInfo = await authenticator.AuthenticateAsync(SharePointResourceId, ServiceIdentifierKind.Resource);

            // Create the SharePoint client proxy:
            return new SharePointClient(new Uri(SharePointServiceRoot), authInfo.GetAccessToken);
        }
    }
}
