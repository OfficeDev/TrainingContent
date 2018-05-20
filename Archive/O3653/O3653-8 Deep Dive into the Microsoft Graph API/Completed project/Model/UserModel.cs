using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace O365_Win_Profile.Model
{
    public class UserModel
    {
        public string id { get; set; }
        public string displayName { get; set; }
        public string jobTitle { get; set; }
        public string userPrincipalName { get; set; }
        public string department { get; set; }
        public string mobilePhone { get; set; }
        public string hireDate { get; set; }
        public string streetAddress { get; set; }
        public string city { get; set; }
        public string country { get; set; }
        

    }
}
