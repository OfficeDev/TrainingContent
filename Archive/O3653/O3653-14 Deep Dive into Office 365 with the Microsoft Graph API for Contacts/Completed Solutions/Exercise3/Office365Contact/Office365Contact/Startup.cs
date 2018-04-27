using System;
using System.Threading.Tasks;
using Microsoft.Owin;
using Owin;

namespace Office365Contact
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            //This is the friendly error message when error occurred missing ClientID, ClientSecret and TenantId in the web.config.
            if (string.IsNullOrEmpty(clientId) || string.IsNullOrEmpty(appKey) || string.IsNullOrEmpty(tenantId))
            {
                throw new Exception("The Client ID, Client Secret and Tenant ID values are missing. Please add the Client ID to the 'ida:ClientID' setting, the Client Secret to the 'ida:ClientSecret' setting, and the Tenant ID to the 'ida:TenantId' setting in web.config.");
            }

            ConfigureAuth(app);
        }
    }
}
