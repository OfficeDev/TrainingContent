using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel;

namespace Office365PlannerTask.Models
{
    public class MyPlan
    {
        public string id { get; set; }
        [DisplayName("Title")]
        public string title { get; set; }
        [DisplayName("Owner")]
        public string owner { get; set; }
        [DisplayName("Created By")]
        public string createdBy { get; set; }
        public string Etag { get; set; }
    }
}