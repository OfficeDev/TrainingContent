using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace Office365Mail.Models
{
    public class MyMessage
    {
        public string Id { get; set; }
        public string ConversationId { get; set; }
        public string Subject { get; set; }
        [DisplayName("From Name")]
        public string FromName { get; set; }
        [DisplayName("From Email Address")]
        public string FromEmailAddress { get; set; }
        [DisplayName("Sent")]
        [DisplayFormat(DataFormatString = "{0:dddd MMMM d, yyyy}")]
        public DateTimeOffset? DateTimeSent { get; set; }
        [DisplayName("Received")]
        [DisplayFormat(DataFormatString = "{0:dddd MMMM d, yyyy}")]
        public DateTimeOffset? DateTimeReceived { get; set; }
        [DisplayName("Has Attachments")]
        public bool? HasAttachments { get; set; }
        public string Importance { get; set; }
        public bool? IsDraft { get; set; }
        [DisplayName("To Name")]
        public string ToName { get; set; }
        [DisplayName("To Email Address")]
        public string ToEmailAddress { get; set; }
        public string Body { get; set; }
    }
}