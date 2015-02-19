using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;


namespace Win8ServiceDiscovery
{/// <summary>
    ///
    /// </summary>
    /// 
    public  class Config 
    {
        // App registration credentials for Microsoft account (Live Id)
        public string MicrosoftAccountClientId = "";
        public string MicrosoftAccountClientSecret = "";
        public string MicrosoftAccountRedirectUri = "";


        // App registration for Organizational account (Office 365 account)
        public string OrganizationalAccountClientId = "adbee37d-bc9a-4235-a63b-ae504b55589e";
                public string OrganizationalAccountRedirectUri = "http://discoveryflowapp";
               
    }
}
