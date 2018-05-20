using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace GraphUsersGroups.Models
{
    using Microsoft.Graph;
    using System;

    public class Profile
    {
        public String photo { get; set; }
        public User user { get; set; }
    }

    public class GroupModel
    {
        public static String groupId { get; set; }
    }
}