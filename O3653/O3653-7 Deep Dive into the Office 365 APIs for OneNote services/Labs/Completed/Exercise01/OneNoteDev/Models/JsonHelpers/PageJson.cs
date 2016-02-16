using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Newtonsoft.Json;

namespace OneNoteDev.Models.JsonHelpers {
  public class PageJson {
    [JsonProperty(PropertyName = "title")]
    public string Title { get; set; }
    [JsonIgnore]
    public string createdByAppId { get; set; }
    [JsonProperty(PropertyName = "links")]
    public LinksJson Links { get; set; }
    [JsonProperty(PropertyName = "contentUrl")]
    public string ContentUrl { get; set; }
    [JsonIgnore]
    public object thumbnailUrl { get; set; }
    [JsonProperty(PropertyName = "lastModifiedTime")]
    public DateTime LastModifiedTime { get; set; }
    [JsonProperty(PropertyName = "id")]
    public string Id { get; set; }
    [JsonProperty(PropertyName = "self")]
    public string PageUrl { get; set; }
    [JsonProperty(PropertyName = "createdTime")]
    public DateTime CreatedTime { get; set; }
    [JsonIgnore]
    public string parentSectionodatacontext { get; set; }
    [JsonIgnore]
    public ParentSectionJson ParentSectionJson { get; set; }
    [JsonIgnore]
    public string parentNotebookodatacontext { get; set; }
    [JsonIgnore]
    public ParentNotebookJson ParentNotebookJson { get; set; }
  }
}