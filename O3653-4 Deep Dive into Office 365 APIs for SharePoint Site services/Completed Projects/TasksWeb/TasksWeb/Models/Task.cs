using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TasksWeb.Models
{
    public class Task
    {
        public string Id { get; set; }
        public string Title { get; set; }

        public string Priority { get; set; }
        public string Status { get; set; }

        public string AssignedTo { get; set; }

    }
}