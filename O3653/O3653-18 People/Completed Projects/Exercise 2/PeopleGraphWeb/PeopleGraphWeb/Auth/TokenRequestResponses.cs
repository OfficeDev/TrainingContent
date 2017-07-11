using Newtonsoft.Json;

namespace PeopleGraphWeb.Auth
{
    // Reference https://msdn.microsoft.com/en-us/library/azure/dn645542.aspx
    public class TokenRequestSuccessResponse
    {
        [JsonProperty("access_token")]
        public string AccessToken;
        [JsonProperty("expires_in")]
        public string ExpiresIn;
        [JsonProperty("expires_on")]
        public string ExpiresOn;
        [JsonProperty("id_token")]
        public string IdToken;
        [JsonProperty("refresh_token")]
        public string RefreshToken;
        [JsonProperty("resource")]
        public string Resource;
        [JsonProperty("scope")]
        public string Scope;
        [JsonProperty("token_type")]
        public string TokenType;

        public string not_before;
        public string pwd_exp;
        public string pwd_url;
    }

    public class TokenRequestErrorResponse
    {
        [JsonProperty("error")]
        public string Error;
        [JsonProperty("error_description")]
        public string Description;
        [JsonProperty("error_codes")]
        public string[] ErrorCodes;
        [JsonProperty("timestamp")]
        public string Timestamp;
        [JsonProperty("trace_id")]
        public string TraceId;
        [JsonProperty("correlation_id")]
        public string CorrelationId;
        [JsonProperty("submit_url")]
        public string SubmitUrl;
        [JsonProperty("context")]
        public string Context;
    }
}