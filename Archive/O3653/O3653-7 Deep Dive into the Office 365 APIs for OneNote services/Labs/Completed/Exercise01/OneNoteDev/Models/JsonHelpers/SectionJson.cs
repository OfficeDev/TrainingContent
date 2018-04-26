using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Newtonsoft.Json;

namespace OneNoteDev.Models.JsonHelpers {
  public class SectionsJson {
    [JsonIgnore]
    public string odatacontext { get; set; }
    [JsonProperty(PropertyName = "value")]
    public SectionJson[] Sections { get; set; }
  }

  public class SectionJson {
    [JsonProperty(PropertyName = "isDefault")]
    public bool IsDefault { get; set; }
    [JsonProperty(PropertyName = "pagesUrl")]
    public string PagesUrl { get; set; }
    [JsonProperty(PropertyName = "name")]
    public string Name { get; set; }
    [JsonIgnore]
    public string createdBy { get; set; }
    [JsonIgnore]
    public string lastModifiedBy { get; set; }
    [JsonProperty(PropertyName = "lastModifiedTime")]
    public DateTime LastModifiedTime { get; set; }
    [JsonProperty(PropertyName = "id")]
    public string Id { get; set; }
    [JsonProperty(PropertyName = "self")]
    public string SectionUrl { get; set; }
    [JsonProperty(PropertyName = "createdTime")]
    public DateTime CreatedTime { get; set; }
    [JsonIgnore]
    public string parentNotebookodatacontext { get; set; }
    [JsonIgnore]
    public ParentNotebookJson ParentNotebookJson { get; set; }
    [JsonIgnore]
    public string parentSectionGroupodatacontext { get; set; }
    [JsonIgnore]
    public object parentSectionGroup { get; set; }
  }
}