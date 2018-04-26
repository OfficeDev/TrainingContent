using Newtonsoft.Json;
using RestServerSideWeb;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace RestServerSideWeb.Models
{
    public class SpChiefExecutiveRepository
    {
        private SharePointContext _spContext;
        public SpChiefExecutiveRepository(SharePointContext spContext)
        {
            _spContext = spContext;
        }
        public async Task<List<SpChiefExecutive>> GetChiefExecutives()
        {
            StringBuilder requestUri = new StringBuilder(_spContext.SPAppWebUrl.ToString())
              .Append("_api/web/lists/getbytitle('CEO List')/items")
              .Append("?$select=Id,Title,TenureStartYear,TenureEndYear")
              .Append("&$orderby=TenureStartYear");

            HttpClient client = new HttpClient();
            HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Get, requestUri.ToString());
            request.Headers.Add("Accept", "application/json;odata=verbose");
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _spContext.UserAccessTokenForSPAppWeb);

            HttpResponseMessage response = await client.SendAsync(request);
            string responseString = await response.Content.ReadAsStringAsync();
            var spJsonResponse = JsonConvert.DeserializeObject<SpChiefExecutiveJsonCollection>(responseString);

            var ceoList = new List<SpChiefExecutive>();
            foreach (var item in spJsonResponse.Data.Results)
            {
                var ceo = new SpChiefExecutive
                {
                    Id = item.Id.ToString(),
                    Name = item.Title,
                    TenureStartYear = item.TenureStartYear,
                    TenureEndYear = item.TenureEndYear
                };
                ceoList.Add(ceo);
            }

            return ceoList.OrderByDescending(c => c.TenureStartYear).ToList();
        }
        private async Task UpdateCurrentCeo()
        {
            // get list of all current CEO's
            var results = await GetChiefExecutives();
            // get CEO with no tenure end date
            var currentCeo = results.FirstOrDefault(ceo => ceo.TenureEndYear == "Present");

            StringBuilder requestUri = new StringBuilder(_spContext.SPAppWebUrl.ToString())
              .Append("_api/web/lists/getbytitle('CEO List')/items")
              .Append("(" + currentCeo.Id + ")");

            // updated ceo
            var existingCeoJson = new SpChiefExecutiveJson
            {
                Metadata = new JsonMetadata { Type = "SP.Data.CEO_x0020_ListListItem" },
                TenureEndYear = "2014"
            };

            StringContent requestContent = new StringContent(JsonConvert.SerializeObject(
              existingCeoJson,
              Formatting.None,
              new JsonSerializerSettings
              {
                  NullValueHandling = NullValueHandling.Ignore
              }));
            requestContent.Headers.ContentType = MediaTypeHeaderValue.Parse("application/json;odata=verbose");

            HttpClient client = new HttpClient();
            HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Post, requestUri.ToString());
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _spContext.UserAccessTokenForSPAppWeb);
            request.Headers.Add("Accept", "application/json;odata=verbose");
            request.Headers.Add("If-Match", "*");
            request.Headers.Add("X-Http-Method", "Merge");
            request.Content = requestContent;

            await client.SendAsync(request);
        }
        private async Task AddNewCeo()
        {
            StringBuilder requestUri = new StringBuilder(_spContext.SPAppWebUrl.ToString())
              .Append("_api/web/lists/getbytitle('CEO List')/items");

            // updated ceo
            var newCeoJson = new SpChiefExecutiveJson
            {
                Metadata = new JsonMetadata { Type = "SP.Data.CEO_x0020_ListListItem" },
                Title = "Satya Nadella",
                TenureStartYear = "2014",
                TenureEndYear = "Present"
            };

            StringContent requestContent = new StringContent(JsonConvert.SerializeObject(
              newCeoJson,
              Formatting.None,
              new JsonSerializerSettings
              {
                  NullValueHandling = NullValueHandling.Ignore
              }));
            requestContent.Headers.ContentType = MediaTypeHeaderValue.Parse("application/json;odata=verbose");

            HttpClient client = new HttpClient();
            HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Post, requestUri.ToString());
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _spContext.UserAccessTokenForSPAppWeb);
            request.Headers.Add("Accept", "application/json;odata=verbose");
            request.Headers.Add("If-Match", "*");
            request.Content = requestContent;

            await client.SendAsync(request);
        }
        public async Task AppointNewCeo()
        {

            // update the current ceo to have end date on tenure
            await UpdateCurrentCeo();

            // appoint a new ceo
            await AddNewCeo();
        }
        public async Task DeleteFirstPerson()
        {
            // get list of all current CEO's
            var results = await GetChiefExecutives();
            // get CEO with no tenure end date
            var currentCeo = results.FirstOrDefault(ceo => ceo.Id == "1");

            StringBuilder requestUri = new StringBuilder(_spContext.SPAppWebUrl.ToString())
              .Append("_api/web/lists/getbytitle('CEO List')/items")
              .Append("(" + currentCeo.Id + ")");

            HttpClient client = new HttpClient();
            HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Delete, requestUri.ToString());
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _spContext.UserAccessTokenForSPAppWeb);
            request.Headers.Add("Accept", "application/json;odata=verbose");
            request.Headers.Add("If-Match", "*");

            await client.SendAsync(request);
        }
    }
}