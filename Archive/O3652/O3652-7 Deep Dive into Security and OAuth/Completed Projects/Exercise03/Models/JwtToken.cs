using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ClientCredsAddin.Models
{
    public class JwtToken
    {
        [JsonProperty(PropertyName = "tid")]
        public string TenantId { get; set; }
        [JsonProperty(PropertyName = "upn")]
        public string UserPrincipalName { get; set; }
        [JsonProperty(PropertyName = "domain")]
        public string Domain
        {
            get
            {
                return (string.IsNullOrEmpty(UserPrincipalName))
                  ? "string.Empty"
                  : UserPrincipalName.Split('@')[1];
            }
        }
    }
}