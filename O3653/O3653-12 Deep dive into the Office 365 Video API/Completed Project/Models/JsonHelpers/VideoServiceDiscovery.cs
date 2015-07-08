using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Newtonsoft.Json;

namespace VideoApiWeb.Models.JsonHelpers {
  public class VideoServiceDiscovery {
    [JsonProperty(PropertyName = "d")]
    public VideoServiceDiscoveryJsonData Data { get; set; }
  }

  public class VideoServiceDiscoveryJsonData {
    [JsonProperty(PropertyName = "__metadata")]
    public VideoServiceDiscoveryMetadataJson Metadata { get; set; }
    public string ChannelUrlTemplate { get; set; }
    public bool IsVideoPortalEnabled { get; set; }
    public string PlayerUrlTemplate { get; set; }
    public string VideoPortalLayoutsUrl { get; set; }
    public string VideoPortalUrl { get; set; }
  }
  public class VideoServiceDiscoveryMetadataJson {
    [JsonProperty(PropertyName = "id")]
    public string Id { get; set; }
    [JsonProperty(PropertyName = "uri")]
    public string Uri { get; set; }
    [JsonProperty(PropertyName = "type")]
    public string Type { get; set; }
  }

}