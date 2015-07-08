using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Newtonsoft.Json;

namespace VideoApiWeb.Models.JsonHelpers {
  public class NewVideoPayload {
    public string Id { get; set; }
    [JsonProperty(PropertyName = "__metadata")]
    public NewVideoPayloadMetadata Metadata { get; set; }
    public string Description { get; set; }
    public string Title { get; set; }
    public string FileName { get; set; }
  }

  public class NewVideoPayloadMetadata {
    [JsonProperty(PropertyName = "type")]
    public string Type { get; set; }
  }


}