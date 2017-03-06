<%@ WebHandler Language="C#" Class="Connector" %>

using System;
using System.Web;
using System.Net.Http;
using System.Configuration;
using System.Threading.Tasks;

public class Connector : HttpTaskAsyncHandler {

    public override bool IsReusable {
        get {
            return false;
        }
    }

    public override Task ProcessRequestAsync(HttpContext context) {
        var client = new HttpClient();
        var url = ConfigurationManager.AppSettings["incomingWebhook"];
        var queryString = context.Request.QueryString;
        var message = "{\"text\": \"" + queryString["text"] + "\"}";
        var body = new StringContent(message, System.Text.Encoding.UTF8, "application/json");
        return client.PostAsync(url, body);
    }
}
