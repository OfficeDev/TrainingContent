using Microsoft.SharePoint.Client;
using Newtonsoft.Json.Linq;
using SharePointOAuthWeb.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace SharePointOAuthWeb.Controllers
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
                .Append("querytext='LastName:H*'&")
                .Append("rowlimit=50&")
                .Append("selectproperties='LastName,FirstName,JobTitle,WorkEmail,WorkPhone'&")
                .Append("sourceid='B09A7990-05EA-4AF9-81EF-EDFAB16C4E31'");

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

            List<Person> people = new List<Person>();

            foreach (var row in rows)
            {

                string lastName = (from c in row["Cells"].Children()
                                   where c["Key"].Value<string>() == "LastName"
                                   select new { LastName = c["Value"].Value<string>() }).First().LastName;
                string firstName = (from c in row["Cells"].Children()
                                    where c["Key"].Value<string>() == "FirstName"
                                    select new { LastName = c["Value"].Value<string>() }).First().LastName;
                string jobTitle = (from c in row["Cells"].Children()
                                   where c["Key"].Value<string>() == "JobTitle"
                                   select new { LastName = c["Value"].Value<string>() }).First().LastName;
                string workEmail = (from c in row["Cells"].Children()
                                    where c["Key"].Value<string>() == "WorkEmail"
                                    select new { LastName = c["Value"].Value<string>() }).First().LastName;
                string workPhone = (from c in row["Cells"].Children()
                                    where c["Key"].Value<string>() == "WorkPhone"
                                    select new { LastName = c["Value"].Value<string>() }).First().LastName;
                if (lastName != null)
                {
                    people.Add(new Person()
                    {
                        LastName = lastName,
                        FirstName = firstName,
                        JobTitle = jobTitle,
                        WorkEmail = workEmail,
                        WorkPhone = workPhone
                    });
                }
            }

            ViewBag.People = people;
            return View();
        }

    }
}
