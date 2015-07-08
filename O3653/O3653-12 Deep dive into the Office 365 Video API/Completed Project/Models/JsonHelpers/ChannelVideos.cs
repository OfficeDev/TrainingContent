using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Newtonsoft.Json;

namespace VideoApiWeb.Models.JsonHelpers {

  public class ChannelVideosSingle{
    [JsonProperty(PropertyName = "d")]
    public ChannelVideosJsonResult Data { get; set; }
  }

  public class ChannelVideosCollection {
    [JsonProperty(PropertyName = "d")]
    public ChannelVideosJsonData Data { get; set; }
  }

  public class ChannelVideosJsonData {
    [JsonProperty(PropertyName = "results")]
    public ChannelVideosJsonResult[] Results { get; set; }
  }

  public class ChannelVideosJsonResult {
    [JsonProperty(PropertyName = "__metadata")]
    public ChannelVideosJsonMetadata Metadata { get; set; }
    public Author Author { get; set; }
    public Owner Owner { get; set; }
    public PeopleInMedia PeopleInMedia { get; set; }
    public string ChannelID { get; set; }
    public DateTime CreatedDate { get; set; }
    public string Description { get; set; }
    public string DisplayFormUrl { get; set; }
    public string FileName { get; set; }
    public string OwnerName { get; set; }
    public string ServerRelativeUrl { get; set; }
    public string ThumbnailUrl { get; set; }
    public string Title { get; set; }
    public string ID { get; set; }
    public string Url { get; set; }
    public int VideoDurationInSeconds { get; set; }
    public int VideoProcessingStatus { get; set; }
    public int ViewCount { get; set; }
    public string YammerObjectUrl { get; set; }
  }

  public class ChannelVideosJsonMetadata {
    [JsonProperty(PropertyName = "id")]
    public string Id { get; set; }
    [JsonProperty(PropertyName = "uri")]
    public string Uri { get; set; }
    [JsonProperty(PropertyName = "type")]
    public string Type { get; set; }
  }

  public class Author {
    [JsonProperty(PropertyName = "__deferred")]
    public AuthorDeferred Deferred { get; set; }
  }

  public class AuthorDeferred {
    [JsonProperty(PropertyName = "uri")]
    public string Uri { get; set; }
  }

  public class Owner {
    [JsonProperty(PropertyName = "__deferred")]
    public OwnerDeferred Deferred { get; set; }
  }

  public class OwnerDeferred {
    [JsonProperty(PropertyName = "uri")]
    public string Uri { get; set; }
  }

  public class PeopleInMedia {
    [JsonProperty(PropertyName = "__deferred")]
    public PeopleInMediaDeferred Deferred { get; set; }
  }

  public class PeopleInMediaDeferred {
    [JsonProperty(PropertyName = "uri")]
    public string Uri { get; set; }
  }

}