using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Office365Contact.Models
{
    public class Contact
    {
        public string id { get; set; }
        public string givenName { get; set; }
        public string surname { get; set; }
        public string companyName { get; set; }
        public List<string> businessPhones { get; set; }
        public List<string> homePhones { get; set; }
        public List<EmailAddress> emailAddresses { get; set; }
    }

    public class EmailAddress
    {
        public string name { get; set; }
        public string address { get; set; }
    }
}