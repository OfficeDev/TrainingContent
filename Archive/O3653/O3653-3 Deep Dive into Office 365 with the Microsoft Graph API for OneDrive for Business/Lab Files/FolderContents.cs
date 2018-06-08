using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Newtonsoft.Json;

namespace OneDriveWeb.Models.JsonHelpers {
  public class FolderContents {
    [JsonIgnore]
    public string odatacontext { get; set; }
    [JsonProperty(PropertyName = "value")]
    public FolderItem[] FolderItems { get; set; }
  }

  public class FolderItem {
    [JsonIgnore]
    public string odatatype { get; set; }
    [JsonIgnore]
    public string odataid { get; set; }
    [JsonIgnore]
    public string odataetag { get; set; }
    [JsonIgnore]
    public string odataeditLink { get; set; }
    [JsonProperty(PropertyName = "createdBy")]
    public CreatedBy CreatedBy { get; set; }
    public string eTag { get; set; }
    [JsonProperty(PropertyName = "folder")]
    public Folder Folder { get; set; }
    [JsonProperty(PropertyName = "id")]
    public string Id { get; set; }
    [JsonProperty(PropertyName = "lastModifiedBy")]
    public LastModifiedBy LastModifiedBy { get; set; }
    [JsonProperty(PropertyName = "name")]
    public string Name { get; set; }
    [JsonProperty(PropertyName = "parentReference")]
    public ParentReference ParentReference { get; set; }
    [JsonProperty(PropertyName = "size")]
    public int FileSize { get; set; }
    [JsonProperty(PropertyName = "createdDateTime")]
    public DateTime CreatedDateTime { get; set; }
    [JsonProperty(PropertyName = "lastModifiedDateTime")]
    public DateTime LastModifiedDateTime { get; set; }
    [JsonProperty(PropertyName = "webUrl")]
    public string WebUrl { get; set; }
    [JsonIgnore]
    public string contentdownloadUrl { get; set; }
    public File file { get; set; }
  }

  public class CreatedBy {
    [JsonProperty(PropertyName = "user")]
    public User User { get; set; }
  }

  public class LastModifiedBy {
    [JsonProperty(PropertyName = "user")]
    public User User { get; set; }
  }

  public class User {
    [JsonProperty(PropertyName = "id")]
    public string Id { get; set; }
    [JsonProperty(PropertyName = "displayName")]
    public string DisplayName { get; set; }
  }

  public class Folder {
    [JsonProperty(PropertyName = "childCount")]
    public int ChildCount { get; set; }
  }

  public class ParentReference {
    [JsonProperty(PropertyName = "driveId")]
    public string DriveId { get; set; }
    [JsonProperty(PropertyName = "id")]
    public string Id { get; set; }
    [JsonProperty(PropertyName = "path")]
    public string Path { get; set; }
  }

  public class File {
  }
}