using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace Office365Group.Models
{
    public class UserModel
    {
        public string Id { get; set; }
        [DisplayName("Display Name")]
        public string displayName { get; set; }
        [DisplayName("Given Name")]
        public string givenName { get; set; }
        [DisplayName("Mail")]
        public string mail { get; set; }
        [DisplayName("Mobile Phone")]
        public string mobilePhone { get; set; }

    }

    public class GroupModel
    {
        public string Id { get; set; }
        [DisplayName("Display Name")]
        public string displayName { get; set; }
        [DisplayName("Description")]
        public string description { get; set; }
    }

    public class ConversationModel
    {
        public string Id { get; set; }
        [DisplayName("Topic")]
        public string topic { get; set; }
        [DisplayName("Preview")]
        public string preview { get; set; }

        [DisplayName("Last Delivered Date Time")]
        [DisplayFormat(DataFormatString = "{0:dddd MMMM d, yyyy}")]
        public DateTimeOffset? lastDeliveredDateTime { get; set; }
    }
    public class ThreadModel
    {
        public string Id { get; set; }
        [DisplayName("Topic")]
        public string topic { get; set; }
        [DisplayName("Preview")]
        public string preview { get; set; }
        [DisplayName("Last Delivered Date Time")]
        [DisplayFormat(DataFormatString = "{0:dddd MMMM d, yyyy}")]
        public DateTimeOffset? lastDeliveredDateTime { get; set; }
    }

    public class EventModel
    {
        public string Id { get; set; }
        [DisplayName("Subject")]
        public string subject { get; set; }
        [DisplayName("BodyPreview")]
        public string bodyPreview { get; set; }
        [DisplayName("Start")]
        [DisplayFormat(DataFormatString = "{0:dddd MMMM d, yyyy}")]
        public DateTime? start { get; set; }
        [DisplayName("End")]
        [DisplayFormat(DataFormatString = "{0:dddd MMMM d, yyyy}")]
        public DateTime? end { get; set; }
        [DisplayName("webLink")]
        public string webLink { get; set; }
    }

    public class FileModel
    {
        public string Id { get; set; }
        [DisplayName("Name")]
        public string name { get; set; }
        [DisplayName("webLink")]
        public string webLink { get; set; }
        [DisplayName("Last Modified Date Time")]
        [DisplayFormat(DataFormatString = "{0:dddd MMMM d, yyyy}")]
        public DateTimeOffset? lastModifiedDateTime { get; set; }
        [DisplayName("size")]
        public string size { get; set; }
    }

    public class PostModel
    {
        public string Id { get; set; }
        [DisplayName("Content")]
        public string content { get; set; }
        [DisplayName("From Email Address")]
        public string fromEmailAddress { get; set; }
        [DisplayName("Sender Email Address")]
        public string senderEmailAddress { get; set; }
    }

}