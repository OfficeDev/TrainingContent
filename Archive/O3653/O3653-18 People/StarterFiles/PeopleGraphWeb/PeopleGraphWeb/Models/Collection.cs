using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PeopleGraphWeb.Models
{
    public class Collection<T>
    {
        [JsonIgnore]
        public string odatacontext { get; set; }
        [JsonProperty(PropertyName = "value")]
        public List<T> value { get; set; }
    }
}