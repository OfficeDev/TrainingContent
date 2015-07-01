using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Newtonsoft.Json;

namespace VideoApiWeb.Models.JsonHelpers {
  public class SpContextInfo {
    [JsonProperty(PropertyName = "d")]
    public SpContextInfoData Data { get; set; }
  }

  public class SpContextInfoData {
    public GetContextWebInformation GetContextWebInformation { get; set; }
  }

  public class GetContextWebInformation {
    [JsonProperty(PropertyName = "__metadata")]
    public GetContextWebInformationMetadata Metadata { get; set; }
    public int FormDigestTimeoutSeconds { get; set; }
    public string FormDigestValue { get; set; }
    public string LibraryVersion { get; set; }
    public string SiteFullUrl { get; set; }
    public SupportedSchemaVersions SupportedSchemaVersions { get; set; }
    public string WebFullUrl { get; set; }
  }

  public class GetContextWebInformationMetadata {
    [JsonProperty(PropertyName = "type")]
    public string Type { get; set; }
  }

  public class SupportedSchemaVersions {
    [JsonProperty(PropertyName = "__metadata")]
    public GetContextWebInformationMetadata Metadata { get; set; }
    [JsonProperty(PropertyName = "results")]
    public string[] Results { get; set; }
  }

}