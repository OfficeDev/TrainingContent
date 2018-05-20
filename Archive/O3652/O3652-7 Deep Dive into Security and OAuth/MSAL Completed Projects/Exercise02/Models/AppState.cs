using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ClientCredsAddin.Models
{
    public class AppState
    {
        public bool AppIsAuthorized { get; set; }
        public string AppOnlyGraphToken { get; set; }

        public Dictionary<string, string> MailboxList { get; set; }

        public AppState()
        {
            this.AppIsAuthorized = false;
            this.MailboxList = new Dictionary<string, string>();
        }
    }
}