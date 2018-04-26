using System;
using System.IO;
using System.Net;
using System.Text;
using System.Web.Http;
using System.Xml;

namespace HelloWorldWeb.Controllers
{
    public class PhotoController : ApiController
    {
        public string Get()
        {
            //you can also set format=js to get a JSON response back. To keep things concise, we'll use XML.
            string url = "http://www.bing.com/HPImageArchive.aspx?format=xml&idx=0&n=1";

            //create the request
            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(url);
            WebResponse response = request.GetResponse();

            using (Stream responseStream = response.GetResponseStream())
            {
                //process the result
                StreamReader reader = new StreamReader(responseStream, Encoding.UTF8);
                string result = reader.ReadToEnd();

                //parse the xml response and to get the URL 
                XmlDocument doc = new XmlDocument();
                doc.LoadXml(result);
                string photoURL = "http://bing.com" + doc.SelectSingleNode("/images/image/url").InnerText;

                //fetch the photo and return it as a Base64Encoded string
                return getPhotoFromURL(photoURL);
            }
        }

        private string getPhotoFromURL(string imageURL)
        {
            var webClient = new WebClient();
            byte[] imageBytes = webClient.DownloadData(imageURL);
            return Convert.ToBase64String(imageBytes);
        }
    }
}