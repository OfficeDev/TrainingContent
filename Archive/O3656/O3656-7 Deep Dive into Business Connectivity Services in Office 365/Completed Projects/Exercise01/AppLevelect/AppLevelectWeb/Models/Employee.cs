using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Web;

namespace AppLevelectWeb.Models
{
    public class Employee
    {
        [DisplayName("Employee ID")]
        public int EmployeeID { get; set; }

        [DisplayName("First Name")]
        public string FirstName { get; set; }

        [DisplayName("Last Name")]
        public string LastName { get; set; }

        [DisplayName("HireDate")]
        public DateTime HireDate { get; set; }

        [DisplayName("Home Phone")]
        public string HomePhone { get; set; }


    }
}