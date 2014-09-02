using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Files.Models
{
    public class MyFile
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Url { get; set; }
        public DateTime TimeCreated { get; set; }
        public DateTime TimeLastModified { get; set; }
    }
}