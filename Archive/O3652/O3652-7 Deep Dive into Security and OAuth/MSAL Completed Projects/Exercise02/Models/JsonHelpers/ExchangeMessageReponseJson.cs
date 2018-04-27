using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Newtonsoft.Json;

namespace ClientCredsAddin.Models.JsonHelpers {
  public class ExchangeMessageReponseJson {
    [JsonProperty(PropertyName = "odatacontext")]
    public string ODataContext { get; set; }
    [JsonProperty(PropertyName = "value")]
    public Message[] Message { get; set; }
  }

  public class Message {
    [JsonProperty(PropertyName = "odataid")]
    public string ODataId { get; set; }
    [JsonProperty(PropertyName = "odataetag")]
    public string ODataEtag { get; set; }
    public string Id { get; set; }
    public string Subject { get; set; }
  }

}