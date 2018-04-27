using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Newtonsoft.Json;

namespace OfficeGraphLab.Models
{
    public class Trending
    {
        [JsonProperty("id")]
        public string Id { get; set; }

        [JsonProperty("weight")]
        public string Weight { get; set; }

        [JsonProperty("resourceVisualization")]
        public ResourceVisualization ResourceVisualization { get; set; }

        [JsonProperty("resourceReference")]
        public ResourceReference ResourceReference { get; set; }
    }

    public class ResourceVisualization
    {
        [JsonProperty("title")]
        public string Title { get; set; }
        [JsonProperty("type")]
        public string Type { get; set; }
        [JsonProperty("mediaType")]
        public string MediaType { get; set; }
        [JsonProperty("previewImageUrl")]
        public string PreviewImageUrl { get; set; }
        [JsonProperty("previewText")]
        public string PreviewText { get; set; }
        [JsonProperty("containerWebUrl")]
        public string ContainerWebUrl { get; set; }
        [JsonProperty("containerDisplayName")]
        public string ContainerDisplayName { get; set; }
        [JsonProperty("containerType")]
        public string ContainerType { get; set; }
    }

    public class ResourceReference
    {
        [JsonProperty("webUrl")]
        public string WebUrl { get; set; }
        [JsonProperty("id")]
        public string Id { get; set; }
        [JsonProperty("type")]
        public string Type { get; set; }
    }
}