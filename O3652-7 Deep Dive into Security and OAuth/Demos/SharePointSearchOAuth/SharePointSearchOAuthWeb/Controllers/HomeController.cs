using Microsoft.SharePoint.Client;
using Newtonsoft.Json.Linq;
using SharePointSearchOAuthWeb.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace SharePointSearchOAuthWeb.Controllers
{
    public class HomeController : Controller
    {
        [SharePointContextFilter]
        public async Task<ActionResult> Index()
        {
            //SharePoint Context
            SharePointAcsContext spContext =
                (SharePointAcsContext)SharePointContextProvider.Current.GetSharePointContext(HttpContext);
            string accessToken = spContext.UserAccessTokenForSPHost;

            //Search Query Uri
            StringBuilder requestUri = new StringBuilder(spContext.SPHostUrl.OriginalString)
                .Append("_api/search/query?")
                .Append("querytext='ContentClass:STS_Web OR ContentClass:STS_Site'&")
                .Append("rowlimit=50&")
                .Append("selectproperties='Title,Path,Description,Author'");

            //Execute Query
            HttpClient client = new HttpClient();
            HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Get, requestUri.ToString());
            request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
            HttpResponseMessage response = await client.SendAsync(request);
            string json = await response.Content.ReadAsStringAsync();

            //Parse JSON
            JObject jsonObject = JObject.Parse(json);
            var rows = from r in jsonObject["PrimaryQueryResult"]["RelevantResults"]["Table"]["Rows"]
                       select r;

            List<Result> results = new List<Result>();

            foreach (var row in rows)
            {

                string title = (from c in row["Cells"].Children()
                                where c["Key"].Value<string>() == "Title"
                                select new { LastName = c["Value"].Value<string>() }).First().LastName;
                string path = (from c in row["Cells"].Children()
                               where c["Key"].Value<string>() == "Path"
                               select new { LastName = c["Value"].Value<string>() }).First().LastName;
                string description = (from c in row["Cells"].Children()
                                      where c["Key"].Value<string>() == "Description"
                                      select new { LastName = c["Value"].Value<string>() }).First().LastName;
                string author = (from c in row["Cells"].Children()
                                 where c["Key"].Value<string>() == "Author"
                                 select new { LastName = c["Value"].Value<string>() }).First().LastName;
                if (title != null)
                {
                    results.Add(new Result()
                    {
                        Title = title,
                        Path = path == null ? string.Empty : path,
                        Description = description == null ? string.Empty : description,
                        Author = author == null ? string.Empty : author
                    });
                }
            }

            ViewBag.Results = results;
            return View();
        }

    }
}
