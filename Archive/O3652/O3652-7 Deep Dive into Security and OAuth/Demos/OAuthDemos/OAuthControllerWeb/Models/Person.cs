using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace OAuthControllerWeb.Models
{
    public class Person
    {
        public string LastName { get; set; }
        public string FirstName { get; set; }
        public string JobTitle { get; set; }
        public string WorkEmail { get; set; }
        public string WorkPhone { get; set; }
    }
}
