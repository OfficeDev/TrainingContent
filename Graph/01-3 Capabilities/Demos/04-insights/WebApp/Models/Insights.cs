using Newtonsoft.Json;
using System;
using System.Collections.Generic;



public class ResourceVisualization
{

    [JsonProperty("title")]
    public string title { get; set; }

    [JsonProperty("type")]
    public string type { get; set; }

    [JsonProperty("mediaType")]
    public string mediaType { get; set; }

    [JsonProperty("previewImageUrl")]
    public string previewImageUrl { get; set; }

    [JsonProperty("previewText")]
    public string previewText { get; set; }

    [JsonProperty("containerWebUrl")]
    public string containerWebUrl { get; set; }

    [JsonProperty("containerDisplayName")]
    public string containerDisplayName { get; set; }

    [JsonProperty("containerType")]
    public string containerType { get; set; }
}

public class ResourceReference
{

    [JsonProperty("webUrl")]
    public string webUrl { get; set; }

    [JsonProperty("id")]
    public string id { get; set; }

    [JsonProperty("type")]
    public string type { get; set; }
}





public class TrendingInsights
{

    [JsonProperty("@odata.context")]
    public string context { get; set; }

    [JsonProperty("value")]
    public IList<TrendingValue> value { get; set; }
}

public class TrendingValue
{

    [JsonProperty("id")]
    public string id { get; set; }

    [JsonProperty("weight")]
    public double weight { get; set; }

    [JsonProperty("resourceVisualization")]
    public ResourceVisualization resourceVisualization { get; set; }

    [JsonProperty("resourceReference")]
    public ResourceReference resourceReference { get; set; }
}

public class SharedInsights
{

    [JsonProperty("@odata.context")]
    public string context { get; set; }

    [JsonProperty("value")]
    public IList<SharedValue> value { get; set; }
}

public class SharedValue
{

    [JsonProperty("id")]
    public string id { get; set; }

    [JsonProperty("lastShared")]
    public LastShared lastShared { get; set; }

    [JsonProperty("resourceVisualization")]
    public ResourceVisualization resourceVisualization { get; set; }

    [JsonProperty("resourceReference")]
    public ResourceReference resourceReference { get; set; }
}

public class SharedBy
{

    [JsonProperty("displayName")]
    public string displayName { get; set; }

    [JsonProperty("address")]
    public string address { get; set; }

    [JsonProperty("id")]
    public string id { get; set; }
}

public class SharingReference
{

    [JsonProperty("webUrl")]
    public string webUrl { get; set; }

    [JsonProperty("id")]
    public string id { get; set; }

    [JsonProperty("type")]
    public string type { get; set; }
}

public class LastShared
{

    [JsonProperty("sharedDateTime")]
    public DateTime sharedDateTime { get; set; }

    [JsonProperty("sharingSubject")]
    public string sharingSubject { get; set; }

    [JsonProperty("sharingType")]
    public string sharingType { get; set; }

    [JsonProperty("sharedBy")]
    public SharedBy sharedBy { get; set; }

    [JsonProperty("sharingReference")]
    public SharingReference sharingReference { get; set; }
}

public class UsedInsights
{

    [JsonProperty("@odata.context")]
    public string context { get; set; }

    [JsonProperty("value")]
    public IList<LastUsedValue> value { get; set; }
}

public class LastUsedValue
{

    [JsonProperty("id")]
    public string id { get; set; }

    [JsonProperty("lastUsed")]
    public LastUsed lastUsed { get; set; }

    [JsonProperty("resourceVisualization")]
    public ResourceVisualization resourceVisualization { get; set; }

    [JsonProperty("resourceReference")]
    public ResourceReference resourceReference { get; set; }
}

public class LastUsed
{

    [JsonProperty("lastAccessedDateTime")]
    public DateTime lastAccessedDateTime { get; set; }

    [JsonProperty("lastModifiedDateTime")]
    public DateTime lastModifiedDateTime { get; set; }
}