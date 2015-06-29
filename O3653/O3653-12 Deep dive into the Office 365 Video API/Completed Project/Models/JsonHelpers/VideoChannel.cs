using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Newtonsoft.Json;

namespace VideoApiWeb.Models.JsonHelpers {

  public class VideoChannel {
    [JsonProperty(PropertyName = "d")]
    public VideoChannelData Data { get; set; }
  }

  public class VideoChannelData {
    [JsonProperty(PropertyName = "results")]
    public VideoChannelResult[] Results { get; set; }
  }

  public class VideoChannelResult {
    [JsonProperty(PropertyName = "__metadata")]
    public VideoChannelMetadata Metadata { get; set; }
    public Search Search { get; set; }
    public SpotlightVideos SpotlightVideos { get; set; }
    public Videos Videos { get; set; }
    public string Description { get; set; }
    public string Id { get; set; }
    public string ServerRelativeUrl { get; set; }
    public string TileHtmlColor { get; set; }
    public string Title { get; set; }
    public bool YammerEnabled { get; set; }
  }

  public class VideoChannelMetadata {
    [JsonProperty(PropertyName = "id")]
    public string Id { get; set; }
    [JsonProperty(PropertyName = "uri")]
    public string Uri { get; set; }
    [JsonProperty(PropertyName = "type")]
    public string Type { get; set; }
  }

  public class Search {
    [JsonProperty(PropertyName = "__deferred")]
    public SearchDeferred Deferred { get; set; }
  }

  public class SearchDeferred {
    [JsonProperty(PropertyName = "uri")]
    public string Uri { get; set; }
  }

  public class SpotlightVideos {
    [JsonProperty(PropertyName = "__deferred")]
    public SpotlightVideosDeferred Deferred { get; set; }
  }

  public class SpotlightVideosDeferred {
    [JsonProperty(PropertyName = "uri")]
    public string Uri { get; set; }
  }

  public class Videos {
    [JsonProperty(PropertyName = "__deferred")]
    public VideosDeferred Deferred { get; set; }
  }

  public class VideosDeferred {
    [JsonProperty(PropertyName = "uri")]
    public string Uri { get; set; }
  }

}