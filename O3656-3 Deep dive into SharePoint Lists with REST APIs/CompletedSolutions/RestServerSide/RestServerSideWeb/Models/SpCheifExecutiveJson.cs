using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Newtonsoft.Json;

namespace RestServerSideWeb.Models {

  public class SpCheifExecutiveJsonCollection {
    [JsonProperty(PropertyName = "d")]
    public DataCollectionResponse Data { get; set; }
  }

  public class SpCheifExecutiveJsonSingle
  {
    [JsonProperty(PropertyName = "d")]
    public SpCheifExecutiveJson Data { get; set; }
  }

  public class DataCollectionResponse {
    [JsonProperty(PropertyName = "results")]
    public SpCheifExecutiveJson[] Results { get; set; }
  }

  public class SpCheifExecutiveJson {
    [JsonProperty(PropertyName = "__metadata")]
    public JsonMetadata Metadata { get; set; }
    public int Id { get; set; }
    public int ID { get; set; }
    public string Title { get; set; }
    public string TenureStartYear { get; set; }
    public string TenureEndYear { get; set; }
  }

  public class JsonMetadata {
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