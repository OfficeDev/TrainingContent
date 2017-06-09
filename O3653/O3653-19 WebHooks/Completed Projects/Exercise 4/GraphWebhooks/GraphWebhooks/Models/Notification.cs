using System;
using Newtonsoft.Json;

namespace GraphWebhooks.Models
{
    // A change notification.
    public class Notification
    {
        // The type of change.
        [JsonProperty(PropertyName = "changeType")]
        public string ChangeType { get; set; }

        // The client state used to verify that the notification is from Microsoft Graph. Compare the value received with the notification to the value you sent with the subscription request.
        [JsonProperty(PropertyName = "clientState")]
        public string ClientState { get; set; }

        // The endpoint of the resource that changed. For example, a message uses the format ../Users/{user-id}/Messages/{message-id}
        [JsonProperty(PropertyName = "resource")]
        public string Resource { get; set; }

        // The UTC date and time when the webhooks subscription expires.
        [JsonProperty(PropertyName = "subscriptionExpirationDateTime")]
        public DateTimeOffset SubscriptionExpirationDateTime { get; set; }

        // The unique identifier for the webhooks subscription.
        [JsonProperty(PropertyName = "subscriptionId")]
        public string SubscriptionId { get; set; }

        // Properties of the changed resource.
        [JsonProperty(PropertyName = "resourceData")]
        public ResourceData ResourceData { get; set; }
    }

    public class ResourceData
    {

        // The ID of the resource.
        [JsonProperty(PropertyName = "id")]
        public string Id { get; set; }

        // The OData etag property.
        [JsonProperty(PropertyName = "@odata.etag")]
        public string ODataEtag { get; set; }

        // The OData ID of the resource. This is the same value as the resource property.
        [JsonProperty(PropertyName = "@odata.id")]
        public string ODataId { get; set; }

        // The OData type of the resource: "#Microsoft.Graph.Message", "#Microsoft.Graph.Event", or "#Microsoft.Graph.Contact".
        [JsonProperty(PropertyName = "@odata.type")]
        public string ODataType { get; set; }
    }
}