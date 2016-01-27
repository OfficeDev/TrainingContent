using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Office365Calendar.Models
{
    public class Event
    {
        public string Id { get; set; }
        public string Subject { get; set; }
        public Start Start { get; set; }
        public End End { get; set; }
        public Location Location { get; set; }
        public Body Body { get; set; }
    }

    public class Start
    {
        public string dateTime { get; set; }
        public string timeZone { get { return "UTC"; } }
    }

    public class End
    {
        public string dateTime { get; set; }
        public string timeZone { get { return "UTC"; } }
    }

    public class Location
    {
        public string address { get; set; }
        public string displayName { get; set; }
    }

    public class Body
    {
        public string contentType { get { return "text"; } }
        public string content { get; set; }
    }
}