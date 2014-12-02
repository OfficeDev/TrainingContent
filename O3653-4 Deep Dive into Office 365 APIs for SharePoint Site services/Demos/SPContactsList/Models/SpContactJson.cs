using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Newtonsoft.Json;

namespace SPContactsList.Models {
  public class SpContactJsonCollection {
    [JsonProperty(PropertyName = "d")]
    public DataCollectionReponse Data { get; set; }
  }

  public class SpContactJsonSingle {
    [JsonProperty(PropertyName = "d")]
    public SpContactJson Data { get; set; }
  }

  public class DataCollectionReponse {
    [JsonProperty(PropertyName = "results")]
    public SpContactJson[] Results { get; set; }
  }
  public class SpContactJson {
    public __Metadata __metadata { get; set; }
    public int Id { get; set; }
    public string Title { get; set; }
    public string FirstName { get; set; }
    public string Email { get; set; }
    public string WorkPhone { get; set; }
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