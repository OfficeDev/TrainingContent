using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace OneNoteDev.Models
{
    public class NotePage
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public DateTime CreatedDateTime { get; set; }
        public DateTime LastModifiedDateTime { get; set; }
        public string ContentUrl { get; set; }
        public string Content { get; set; }
        public string PageUrl { get; set; }
        public string WebUrl { get; set; }
        public string ClientUrl { get; set; }
    }
}