using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Web;

namespace EmployeeDirectoryWeb.Models
{
    public class Person
    {
        [DisplayName("First Name")]
        public string FirstName { get; set; }

        [DisplayName("Last Name")]
        public string LastName { get; set; }

        [DisplayName("E-mail Address")]
        public string WorkEmail { get; set; }

        [DisplayName("Phone")]
        public string WorkPhone { get; set; }

    }
}