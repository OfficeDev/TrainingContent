using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.IO;
using System.Web.Mvc;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using System.Security.Claims;
using Microsoft.IdentityModel.Clients.ActiveDirectory;
using System.Configuration;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using GraphExcel.Models;

namespace GraphExcel.Helpers
{
    public class ExcelAPIHelper
    {
        public async Task<string> GetGraphAccessTokenAsync()
        {
            var AzureAdGraphResourceURL = "https://graph.microsoft.com/";
            var Authority = ConfigurationManager.AppSettings["ida:AADInstance"] + ConfigurationManager.AppSettings["ida:TenantId"];
            var signInUserId = ClaimsPrincipal.Current.FindFirst(ClaimTypes.NameIdentifier).Value;
            var userObjectId = ClaimsPrincipal.Current.FindFirst("http://schemas.microsoft.com/identity/claims/objectidentifier").Value;
            var clientCredential = new ClientCredential(ConfigurationManager.AppSettings["ida:ClientId"], ConfigurationManager.AppSettings["ida:ClientSecret"]);
            var userIdentifier = new UserIdentifier(userObjectId, UserIdentifierType.UniqueId);

            AuthenticationContext authContext = new AuthenticationContext(Authority, new ADALTokenCache(signInUserId));
            var result = await authContext.AcquireTokenSilentAsync(AzureAdGraphResourceURL, clientCredential, userIdentifier);
            return result.AccessToken;
        }
        public async Task<string> GetFileId(string accessToken)
        {
            string excelName = "ToDoListFinal.xlsx";
            string ret = "";
            using (var client = new HttpClient())
            {
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

                // New code:
                HttpResponseMessage response = await client.GetAsync("https://graph.microsoft.com/testexcel/me/drive/root/children?$select=id&$filter=name eq '" + excelName + "'");
                if (response.IsSuccessStatusCode)
                {
                    string resultString = await response.Content.ReadAsStringAsync();

                    dynamic x = Newtonsoft.Json.JsonConvert.DeserializeObject(resultString);
                    var y = x.value[0];
                    ret = y.id;
                }
            }
            return ret;
        }
        private List<ToDoItem> BuildList(List<ToDoItem> todoItems, JArray y)
        {
            foreach (var item in y.Children())
            {
                var itemProperties = item.Children<JProperty>();
                var element = itemProperties.FirstOrDefault(xx => xx.Name == "values");
                JProperty index = itemProperties.FirstOrDefault(xxx => xxx.Name == "index");
                JToken values = element.Value;
                var stringValues = from stringValue in values select stringValue;
                foreach (JToken thing in stringValues)
                {
                    IEnumerable<string> rowValues = thing.Values<string>();
                    string[] stringArray = rowValues.Cast<string>().ToArray();
                    try
                    {
                        ToDoItem todoItem = new ToDoItem(
                             Convert.ToInt32(index.Value),
                             stringArray[1],
                             stringArray[3],
                             stringArray[4],
                             stringArray[2],
                             stringArray[5],
                             stringArray[6],
                        stringArray[7]);
                        todoItems.Add(todoItem);
                    }
                    catch (FormatException f)
                    {
                        Console.WriteLine(f.Message);
                    }
                }
            }
            return todoItems;
        }
        public async Task CreateToDoItem(string title, string priority, string status, string percentComplete, string startDate, string endDate, string notes)
        {
            string accessToken = await GetGraphAccessTokenAsync();
            string fileId = await GetFileId(accessToken);

            int id = new Random().Next(1, 1000);
            var priorityString = "";
            switch (priority)
            {
                case "1":
                    priorityString = "High";
                    break;
                case "2":
                    priorityString = "Normal";
                    break;
                case "3":
                    priorityString = "Low";
                    break;
            }

            var statusString = "";
            switch (status)
            {
                case "1":
                    statusString = "Not started";
                    break;
                case "2":
                    statusString = "In-progress";
                    break;
                case "3":
                    statusString = "Completed";
                    break;
            }
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri("https://graph.microsoft.com/testexcel/me/drive/items/" + fileId + "/workbook/worksheets('ToDoList')/");
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
                using (var request = new HttpRequestMessage(HttpMethod.Post, client.BaseAddress))
                {
                    object[,] valuesArray = new object[1, 8] { { id, title, percentComplete.ToString(), priorityString, statusString, startDate, endDate, notes } };
                    RequestBodyHelper requestBodyHelper = new RequestBodyHelper();
                    requestBodyHelper.index = null;
                    requestBodyHelper.values = valuesArray;
                    string postPayload = JsonConvert.SerializeObject(requestBodyHelper);
                    request.Content = new StringContent(postPayload, System.Text.Encoding.UTF8);

                    using (HttpResponseMessage response = await client.PostAsync("tables('ToDoList')/rows", request.Content))
                    {
                        if (response.IsSuccessStatusCode)
                        {
                            string resultString = await response.Content.ReadAsStringAsync();
                            dynamic x = JsonConvert.DeserializeObject(resultString);
                        }
                    }
                }
            }
        }
        public class RequestBodyHelper
        {
            public object index;
            public object[,] values;
        }
        public async Task<string> GetCharId(string accessToken, string excelId, string chartName)
        {
            string ret = "";
            using (var client = new HttpClient())
            {
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

                HttpResponseMessage response = await client.GetAsync("https://graph.microsoft.com/testexcel/me/drive/items/" + excelId + "/workbook/worksheets('Summary')/charts");
                if (response.IsSuccessStatusCode)
                {
                    string resultString = await response.Content.ReadAsStringAsync();

                    dynamic x = JsonConvert.DeserializeObject(resultString);
                    JArray array = x.value;
                    var y = array.FirstOrDefault(xx => xx["name"].ToString().Equals(chartName));
                    ret = y["id"].ToString();
                }
            }
            return ret;
        }
        public async Task<FileContentResult> getChartImage()
        {
            string accessToken = await GetGraphAccessTokenAsync();
            string fileId = await GetFileId(accessToken);
            string chartId = await GetCharId(accessToken, fileId, "Chart 1");

            FileContentResult returnValue = null;
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri("https://graph.microsoft.com/testexcel/me/drive/items/" + fileId + "/workbook/worksheets('Summary')/");
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

                HttpResponseMessage response = await client.GetAsync("charts('" + chartId + "')/Image(width=0,height=0,fittingMode='fit')");
                if (response.IsSuccessStatusCode)
                {
                    string resultString = await response.Content.ReadAsStringAsync();

                    dynamic x = JsonConvert.DeserializeObject(resultString);
                    JToken y = x.Last;
                    Bitmap imageBitmap = StringToBitmap(x["value"].ToString());
                    ImageConverter converter = new ImageConverter();
                    byte[] bytes = (byte[])converter.ConvertTo(imageBitmap, typeof(byte[]));
                    returnValue = new FileContentResult(bytes, "image/bmp");
                }
                return returnValue;
            }
        }
        public Bitmap StringToBitmap(string base64ImageString)
        {
            Bitmap bmpReturn = null;
            byte[] byteBuffer = Convert.FromBase64String(base64ImageString);
            MemoryStream memoryStream = new MemoryStream(byteBuffer);

            memoryStream.Position = 0;

            bmpReturn = (Bitmap)Bitmap.FromStream(memoryStream);
            memoryStream.Close();
            memoryStream = null;
            byteBuffer = null;
            return bmpReturn;
        }
    }
}