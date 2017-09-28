using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApp.Models
{
    /*
     *  Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license.
     *  See LICENSE in the source repository root for complete license information.
     */

    using System;
    using Newtonsoft.Json;
    using System.Collections.Generic;

    namespace GraphWebhooks.Models
    {
        // An Outlook mail message (partial representation). 
        // See https://developer.microsoft.com/graph/docs/api-reference/v1.0/resources/message
        public class Message
        {
            [JsonProperty(PropertyName = "id")]
            public string Id { get; set; }

            [JsonProperty(PropertyName = "subject")]
            public string Subject { get; set; }

            [JsonProperty(PropertyName = "bodyPreview")]
            public string BodyPreview { get; set; }

            [JsonProperty(PropertyName = "createdDateTime")]
            public DateTimeOffset CreatedDateTime { get; set; }

            [JsonProperty(PropertyName = "isRead")]
            public Boolean IsRead { get; set; }

            [JsonProperty(PropertyName = "conversationId")]
            public string ConversationId { get; set; }

            [JsonProperty(PropertyName = "changeKey")]
            public string ChangeKey { get; set; }
        }
        
    }

}