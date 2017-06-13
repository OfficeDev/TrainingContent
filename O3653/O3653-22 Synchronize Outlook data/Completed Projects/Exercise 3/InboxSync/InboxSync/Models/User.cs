using Newtonsoft.Json;

namespace InboxSync.Models
{
    public class User
    {
        [JsonProperty(PropertyName = "id")]
        public string Id { get; set; }
        [JsonProperty(PropertyName = "email")]
        public string Email { get; set; }
    }
}