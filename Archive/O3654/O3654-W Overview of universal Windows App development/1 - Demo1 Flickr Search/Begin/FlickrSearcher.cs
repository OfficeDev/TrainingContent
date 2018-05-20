using System;
using System.Linq;
using System.Xml.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Windows.Web.Http;

namespace FlickrSearch
{

  public class FlickrPhotoResult
  {
    public FlickrPhotoResult(XElement photo)
    {
      Id = (long)photo.Attribute("id");
      Secret = photo.Attribute("secret").Value;
      Farm = (int)photo.Attribute("farm");
      Server = (int)photo.Attribute("server");
      Title = photo.Attribute("title").Value;
    }
    public long Id { get; private set; }
    public string Secret { get; private set; }
    public int Farm { get; private set; }
    public string Title { get; private set; }
    public int Server { get; private set; }

    public string ImageUrl
    {
      get
      {
        return (string.Format(
          "https://farm{0}.static.flickr.com/{1}/{2}_{3}_m.jpg",
          Farm, Server, Id, Secret));
      }
    }
  }
  public static class FlickrSearcher
  {
    public static async Task<List<FlickrPhotoResult>> SearchAsync(string searchTerm)
    {
      HttpClient client = new HttpClient();
      FlickrSearchUrl url = new FlickrSearchUrl(searchTerm);
      List<FlickrPhotoResult> list = new List<FlickrPhotoResult>();

      using (HttpResponseMessage response = await client.GetAsync(new Uri(url.ToString(), UriKind.Absolute)))
      {
        if (response.IsSuccessStatusCode)
        {
            String contentxml = await response.Content.ReadAsStringAsync();
            XElement xml = XElement.Parse(contentxml);
            list =
                (
                    from p in xml.DescendantsAndSelf("photo")
                    select new FlickrPhotoResult(p)
                ).ToList();
        }
      }
      return (list);
    }
    public static async Task<List<string>> GetHotlistTagsAsync(string userText)
    {
      HttpClient client = new HttpClient();
      string uri = FlickrSearchUrl.hottagsUri;
      List<string> results = new List<string>();

      using (HttpResponseMessage response = await client.GetAsync(new Uri(uri.ToString(), UriKind.Absolute)))
      {
          if (response.IsSuccessStatusCode)
          {
              String contentxml = await response.Content.ReadAsStringAsync();
              XElement xml = XElement.Parse(contentxml);
              results =
                (
                  from tag in xml.DescendantsAndSelf("tag")
                  where tag.Value.Contains(userText)
                  select tag.Value
                ).ToList();
          }
      }
      return (results.GetRange(0, Math.Min(5, results.Count)));
    }

    #region Internal_Class
    internal class FlickrSearchUrl
    {
//#error Add your flickR API key here
      static string apiKey = "042bddb721dbc8cd4dadb237bfd4624f";
      static string serviceUri = "https://api.flickr.com/services/rest/?method=";
      static string baseUri = serviceUri + "flickr.photos.search&";
      public static readonly string hottagsUri = serviceUri + "flickr.tags.getHotList&api_key=" + apiKey;

      public int ContentType { get; set; }
      public int PerPage { get; set; }
      public int Page { get; set; }
      public string SearchTerm { get; set; }

      public FlickrSearchUrl(
          string searchTerm,
          int pageNo = 1,
          int perPage = 50,
          int contentType = 1
      )
      {
        this.SearchTerm = searchTerm;
        this.Page = pageNo;
        this.PerPage = perPage;
        this.ContentType = contentType;
      }
      public override string ToString()
      {
        return (
          string.Format(
            baseUri +
            "api_key={0}&" +
            "safe_search=1&" +
            "text={1}&" +
            "page={2}&" +
            "per_page={3}&" +
            "content_type={4}",
            apiKey, this.SearchTerm, this.Page, this.PerPage, this.ContentType));
      }
    }
    #endregion

  }
}
