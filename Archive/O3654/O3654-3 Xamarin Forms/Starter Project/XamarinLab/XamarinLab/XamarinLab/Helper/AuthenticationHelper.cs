using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Identity.Client;

namespace XamarinLab.Helper
{
    class AuthenticationHelper
    {
        public static string userToken = null;
        public static DateTimeOffset expiration;
    }
}
