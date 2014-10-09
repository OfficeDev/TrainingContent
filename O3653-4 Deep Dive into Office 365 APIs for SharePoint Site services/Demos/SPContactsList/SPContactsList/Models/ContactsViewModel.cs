using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SPContactsList.Models
{
    public class ContactsViewModel
    {
        public int PageIndex { get; set; }
        public int PageSize { get; set; }
        public List<Contact> Contacts { get; set; }
    }
}