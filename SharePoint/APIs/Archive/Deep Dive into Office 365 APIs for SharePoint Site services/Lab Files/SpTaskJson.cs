using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Newtonsoft.Json;

namespace TasksWeb.Models {
  public class SpTaskJsonCollection {
    [JsonProperty(PropertyName = "d")]
    public DataCollectionReponse Data { get; set; }
  }

  public class SpTaskJsonSingle {
    [JsonProperty(PropertyName = "d")]
    public SpTaskJson Data { get; set; }
  }

  public class DataCollectionReponse {
    [JsonProperty(PropertyName = "results")]
    public SpTaskJson[] Results { get; set; }
  }
  public class SpTaskJson {
    public __Metadata __metadata { get; set; }
    public int Id { get; set; }
    public string Title { get; set; }
    public string Priority { get; set; }
    public string Status { get; set; }
    public int ID { get; set; }
  }

  public class __Metadata {
    [JsonProperty(PropertyName = "id")]
    public string Id { get; set; }
    [JsonProperty(PropertyName = "uri")]
    public string Uri { get; set; }
    [JsonProperty(PropertyName = "etag")]
    public string ETag { get; set; }
    [JsonProperty(PropertyName = "type")]
    public string Type { get; set; }
  }

}