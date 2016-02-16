using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace OneNoteDev.Models
{
    public class Notebook
    {
        public Notebook()
        {
            Sections = new List<Section>();
        }

        public string Id { get; set; }
        public string Name { get; set; }
        public string NotebookUrl { get; set; }
        public string ClientUrl { get; set; }
        public string WebUrl { get; set; }
        public bool IsDefault { get; set; }
        public DateTime CreatedDateTime { get; set; }
        public DateTime LastModifiedDateTime { get; set; }
        public string SectionsUrl { get; set; }
        public string SectionGroupsUrl { get; set; }
        public List<Section> Sections { get; set; }
    }
}