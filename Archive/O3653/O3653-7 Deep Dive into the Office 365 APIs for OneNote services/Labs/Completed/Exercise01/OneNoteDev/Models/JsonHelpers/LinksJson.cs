using Newtonsoft.Json;

namespace OneNoteDev.Models.JsonHelpers
{
  public class LinksJson {
    [JsonProperty(PropertyName = "oneNoteClientUrl")]
    public LinkJson OneNoteClientUrl { get; set; }
    [JsonProperty(PropertyName = "oneNoteWebUrl")]
    public LinkJson OneNoteWebUrl { get; set; }
  }
}