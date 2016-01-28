using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using WinOffice365Calendar.Model;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace WinOffice365Calendar
{
    class UserOperations
    {
        public static async Task<string> GetJsonAsync(string url)
        {
            var accessToken = await AuthenticationHelper.GetGraphAccessTokenAsync();
            using (HttpClient client = new HttpClient())
            {
                var accept = "application/json";

                client.DefaultRequestHeaders.Add("Accept", accept);
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

                using (var response = await client.GetAsync(url))
                {
                    if (response.IsSuccessStatusCode)
                        return await response.Content.ReadAsStringAsync();
                    return null;
                }
            }
        }

        public async Task<List<EventModel>> GetMyEvents()
        {
            
        }
    }
}
