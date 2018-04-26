using System;
using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;

namespace InboxSync.Models
{
    public class EmailAddress
    {
        [JsonProperty(PropertyName = "name")]
        [DisplayFormat(ConvertEmptyStringToNull = true, NullDisplayText = "*no name*")]
        public string Name { get; set; }

        [JsonProperty(PropertyName = "address")]
        [DisplayFormat(ConvertEmptyStringToNull = true, NullDisplayText = "*no email*")]
        public string Address { get; set; }
    }
    public class FromField
    {
        [JsonProperty(PropertyName = "emailaddress")]
        public EmailAddress EmailAddress { get; set; }
    }
    public class Message
    {
        [JsonProperty(PropertyName = "id")]
        public string Id { get; set; }
        [JsonProperty(PropertyName = "owner")]
        public string Owner { get; set; }
        [JsonProperty(PropertyName = "outlookid")]
        public string OutlookId { get; set; }
        [JsonProperty(PropertyName = "bodypreview")]
        [DisplayFormat(ConvertEmptyStringToNull = true, NullDisplayText = "*no body*")]
        public string BodyPreview { get; set; }
        [JsonProperty(PropertyName = "from")]
        public FromField From { get; set; }
        [JsonProperty(PropertyName = "isread")]
        public bool IsRead { get; set; }
        [JsonProperty(PropertyName = "receiveddateTime")]
        public DateTime ReceivedDateTime { get; set; }
        [JsonProperty(PropertyName = "subject")]
        [DisplayFormat(ConvertEmptyStringToNull = true, NullDisplayText = "*no subject*")]
        public string Subject { get; set; }
    }
}