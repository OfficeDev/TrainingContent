using Newtonsoft.Json;
using SPWebhooksReceiver.Models;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Http.Tracing;

namespace SPWebhooksReceiver.Controllers
{
    public class SPWebhookController : ApiController
    {
        [HttpPost]
        public HttpResponseMessage HandleRequest()
        {
            HttpResponseMessage httpResponse = new HttpResponseMessage(HttpStatusCode.BadRequest);
            var traceWriter = Configuration.Services.GetTraceWriter();
            string validationToken = string.Empty;
            IEnumerable<string> clientStateHeader = new List<string>();
            string webhookClientState = ConfigurationManager.AppSettings["webhookclientstate"].ToString();

            if (Request.Headers.TryGetValues("ClientState", out clientStateHeader))
            {
                string clientStateHeaderValue = clientStateHeader.FirstOrDefault() ?? string.Empty;

                if (!string.IsNullOrEmpty(clientStateHeaderValue) && clientStateHeaderValue.Equals(webhookClientState))
                {
                    traceWriter.Trace(Request, "SPWebhooks",
                        TraceLevel.Info,
                        string.Format("Received client state: {0}", clientStateHeaderValue));

                    var queryStringParams = HttpUtility.ParseQueryString(Request.RequestUri.Query);

                    if (queryStringParams.AllKeys.Contains("validationtoken"))
                    {
                        httpResponse = new HttpResponseMessage(HttpStatusCode.OK);
                        validationToken = queryStringParams.GetValues("validationtoken")[0].ToString();
                        httpResponse.Content = new StringContent(validationToken);

                        traceWriter.Trace(Request, "SPWebhooks",
                            TraceLevel.Info,
                            string.Format("Received validation token: {0}", validationToken));
                        return httpResponse;
                    }
                    else
                    {
                        var requestContent = Request.Content.ReadAsStringAsync().Result;

                        if (!string.IsNullOrEmpty(requestContent))
                        {
                            SPWebhookNotification notification = null;

                            try
                            {
                                var objNotification = JsonConvert.DeserializeObject<SPWebhookContent>(requestContent);
                                notification = objNotification.Value[0];
                            }
                            catch (JsonException ex)
                            {
                                traceWriter.Trace(Request, "SPWebhooks",
                                    TraceLevel.Error,
                                    string.Format("JSON deserialization error: {0}", ex.InnerException));
                                return httpResponse;
                            }

                            if (notification != null)
                            {
                                Task.Factory.StartNew(() =>
                                {
                                    //handle the notification here
                                    //you can send this to an Azure queue to be processed later
                                    //for this sample, we just log to the trace

                                    traceWriter.Trace(Request, "SPWebhook Notification",
                                        TraceLevel.Info, string.Format("Resource: {0}", notification.Resource));
                                    traceWriter.Trace(Request, "SPWebhook Notification",
                                        TraceLevel.Info, string.Format("SubscriptionId: {0}", notification.SubscriptionId));
                                    traceWriter.Trace(Request, "SPWebhook Notification",
                                        TraceLevel.Info, string.Format("TenantId: {0}", notification.TenantId));
                                    traceWriter.Trace(Request, "SPWebhook Notification",
                                        TraceLevel.Info, string.Format("SiteUrl: {0}", notification.SiteUrl));
                                    traceWriter.Trace(Request, "SPWebhook Notification",
                                        TraceLevel.Info, string.Format("WebId: {0}", notification.WebId));
                                    traceWriter.Trace(Request, "SPWebhook Notification",
                                        TraceLevel.Info, string.Format("ExpirationDateTime: {0}", notification.ExpirationDateTime));

                                });

                                httpResponse = new HttpResponseMessage(HttpStatusCode.OK);
                            }
                        }
                    }
                }
                else
                {
                    httpResponse = new HttpResponseMessage(HttpStatusCode.Forbidden);
                }
            }

            return httpResponse;
        }
    }
}
