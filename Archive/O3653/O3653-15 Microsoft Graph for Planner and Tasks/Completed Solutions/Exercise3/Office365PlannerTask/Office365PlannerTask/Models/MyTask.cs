using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel;

namespace Office365PlannerTask.Models
{
    public class MyTask
    {
        public string id { get; set; }
        [DisplayName("Title")]
        public string title { get; set; }
        [DisplayName("Percent Complete")]
        public int percentComplete { get; set; }
        public string planId { get; set; }
        public string Etag { get; set; }
    }
}