using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Web;

namespace MiniCRMAppWeb.Models
{
    public class Customer
    {
        [DisplayName("First Name")]
        public string FirstName {get; set;}

        [DisplayName("Last Name")]
        public string LastName {get; set;}

        public string Company { get; set;}
        
        [DisplayName("Work Phone")]
        public string WorkPhone {get; set;}

        [DisplayName("Home Phone")]
        public string HomePhone {get; set;}

        [DisplayName("E-mail Address")]
        public string EmailAddress { get; set; }
    }
}