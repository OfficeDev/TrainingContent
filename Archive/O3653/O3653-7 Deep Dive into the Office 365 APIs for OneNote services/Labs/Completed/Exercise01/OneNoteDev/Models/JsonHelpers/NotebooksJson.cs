using System;
using Newtonsoft.Json;

namespace OneNoteDev.Models.JsonHelpers
{
  public class NotebooksJson {
    [JsonIgnore]
    public string odatacontext { get; set; }
    [JsonProperty(PropertyName = "value")]
    public NotebookJson[] Notebooks { get; set; }
  }

  public class NotebookJson {
    [JsonProperty(PropertyName = "isDefault")]
    public bool IsDefault { get; set; }
    [JsonIgnore]
    public string userRole { get; set; }
    [JsonIgnore]
    public bool isShared { get; set; }
    [JsonProperty(PropertyName = "sectionsUrl")]
    public string SectionsUrl { get; set; }
    [JsonProperty(PropertyName = "sectionGroupsUrl")]
    public string SectionGroupsUrl { get; set; }
    [JsonProperty(PropertyName = "links")]
    public LinksJson Links { get; set; }
    [JsonProperty(PropertyName = "name")]
    public string Name { get; set; }
    [JsonIgnore]
    public string createdBy { get; set; }
    [JsonIgnore]
    public string lastModifiedBy { get; set; }
    [JsonProperty(PropertyName = "lastModifiedTime")]
    public DateTime LastModifiedTime { get; set; }
    [JsonProperty(PropertyName = "Id")]
    public string Id { get; set; }
    [JsonProperty(PropertyName = "self")]
    public string NotebookUrl { get; set; }
    [JsonProperty(PropertyName = "createdTime")]
    public DateTime CreatedTime { get; set; }
  }
}