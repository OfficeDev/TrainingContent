using System;
using System.Threading.Tasks;
using Microsoft.Owin;
using Owin;

namespace OneNoteDev
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            //This is the friendly error message when error occurred missing ClientID, ClientSecret and TenantId in the web.config.
            if (string.IsNullOrEmpty(clientId) || string.IsNullOrEmpty(appKey) || string.IsNullOrEmpty(tenantId))
            {
                throw new Exception("Please input the string values of 'ida: ClientId', 'ida: ClientSecret' and 'ida: TenantId' in the web.config.");
            }

            ConfigureAuth(app);
        }
    }
}
