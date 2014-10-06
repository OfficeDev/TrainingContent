using Microsoft.Office365.SharePoint;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Files.Models
{
    public class FileViewModel
    {
        public int PageIndex { get; set; }
        public int PageSize { get; set; }

        public List<MyFile> MyFiles { get; set; }
    }
}