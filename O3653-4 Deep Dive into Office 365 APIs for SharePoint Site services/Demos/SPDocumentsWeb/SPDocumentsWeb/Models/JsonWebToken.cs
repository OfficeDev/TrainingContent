using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SPDocumentsWeb.Models
{
    public class JsonWebToken
    {
        public string token_type { get; set; }
        public string expires_in { get; set; }
        public string expires_on { get; set; }
        public string not_before { get; set; }
        public string resource { get; set; }
        public string access_token { get; set; }
        public string pwd_exp { get; set; }
        public string pwd_url { get; set; }

        public static JsonWebToken Deserialize(string json)
        {
            return Newtonsoft.Json.JsonConvert.DeserializeObject<JsonWebToken>(json);
        }
    }
}