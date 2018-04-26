using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ClientCredsAddin.Models
{
    public class MailViewModel
    {
        public string SelectedMailbox;
        public List<string> Messages;
        public AppState AppState;
        public List<SelectListItem> UserListSelectors;

        public MailViewModel()
        {
            SelectedMailbox = string.Empty;
            Messages = new List<string>();
        }
    }
}