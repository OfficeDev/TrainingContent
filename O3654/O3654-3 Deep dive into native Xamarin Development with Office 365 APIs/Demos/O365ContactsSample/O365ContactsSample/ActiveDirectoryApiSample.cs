using Android.Content;
using Microsoft.Office365.OAuth;
using Microsoft.Office365.ActiveDirectory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace O365ContactsSample
{
    public static class ActiveDirectoryApiSample
    {
        const string AadGraphResource = "https://graph.windows.net/";

        public static async Task<IEnumerable<IUser>> GetUsers(Context context)
        {
            var client = await EnsureClientCreated(context);

            var userResults = await client.DirectoryObjects.OfType<IUser>().ExecuteAsync();

            List<IUser> allUsers = new List<IUser>();

            do
            {
                allUsers.AddRange(userResults.CurrentPage);
                userResults = await userResults.GetNextPageAsync();
            } while (userResults != null);

            return allUsers;
        }

        public static async Task<AadGraphClient> EnsureClientCreated(Context context)
        {
            Authenticator authenticator = new Authenticator(context);
            var authInfo = await authenticator.AuthenticateAsync(AadGraphResource);

            return new AadGraphClient(new Uri(AadGraphResource + authInfo.IdToken.TenantId), authInfo.GetAccessToken);
        }
    }
}
