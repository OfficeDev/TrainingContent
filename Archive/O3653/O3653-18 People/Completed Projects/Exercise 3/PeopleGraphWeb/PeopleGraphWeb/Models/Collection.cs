using System;
using System.Linq;
using System.Web;
using System.Collections.Generic;
using Newtonsoft.Json;

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