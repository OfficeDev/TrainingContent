using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using System.ComponentModel;


namespace Office365Contacts.Models {
    public class MyContact {
        public string Id { get; set; }
        [DisplayName("First Name")]
        public string GivenName { get; set; }
        [DisplayName("Last Name")]
        public string Surname { get; set; }
        [DisplayName("Company")]
        public string CompanyName { get; set; }
        [DisplayName("Work Phone")]
        public string BusinessPhone1 { get; set; }
        [DisplayName("Home Phone")]
        public string HomePhone1 { get; set; }
        [DisplayName("Email Address")]
        public string EmailAddress1 { get; set; }
    }
}