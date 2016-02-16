using Newtonsoft.Json;

namespace OneNoteDev.Models.JsonHelpers
{
  public class PagesJson {
    [JsonIgnore]
    public string odatacontext { get; set; }
    [JsonProperty(PropertyName = "value")]
    public PageJson[] Pages { get; set; }
  }
}