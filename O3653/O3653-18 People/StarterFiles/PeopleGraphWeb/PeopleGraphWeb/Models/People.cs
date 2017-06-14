using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Newtonsoft.Json;

namespace PeopleGraphWeb.Models
{
    public class People
    {
        [JsonProperty("id")]
        public string Id { get; set; }
        [JsonProperty("displayName")]
        public string DisplayName { get; set; }
        [JsonProperty("title")]
        public string Title { get; set; }
        [JsonProperty("department")]
        public string Department { get; set; }
    }
}