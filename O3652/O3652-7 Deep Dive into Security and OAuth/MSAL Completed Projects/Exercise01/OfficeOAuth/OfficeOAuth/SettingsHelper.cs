using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Configuration;

namespace OfficeOAuth
{
    public class SettingsHelper
    {
        public static string AppId
        {
            get { return ConfigurationManager.AppSettings["AppId"]; }
        }

        public static string AppPassword
        {
            get { return ConfigurationManager.AppSettings["AppPassword"]; }
        }
    }
}