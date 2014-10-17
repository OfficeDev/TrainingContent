using Microsoft.IdentityModel.Clients.ActiveDirectory;
using Microsoft.Office365.OAuth;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Windows.Graphics.Imaging;
using Windows.Security.Authentication.Web;
using Windows.Storage.Streams;
using Windows.UI.Xaml.Media.Imaging;

namespace O365Universal
{
    public class MyFilesController
    {
        private string CLIENT_ID = (string)App.Current.Resources["ida:ClientID"];
        private const string AUTHORITY = "https://login.windows.net/{0}";
        private const string TENANT = "contoso.onmicrosoft.com";
        private const string DISCOVERY_SERVICE_URI = "https://api.office.com/discovery/me/services";
        private Uri redirectURI;

        public AuthenticationContext AuthContext { get; set; }
        public List<Resource> Resources { get; set; }

        public MyFilesController()
        {
            //initialize the redirect uri for this app
            redirectURI = Windows.Security.Authentication.Web.WebAuthenticationBroker.GetCurrentApplicationCallbackUri();
        }

        /// <summary>
        /// Ensure the user is logged in by leveraging WebAuthenticationBroker and then calls discovery service for resource details
        /// </summary>
        /// <returns></returns>
        public async Task<AuthenticationResult> EnsureClientCreated()
        {
            //get resource token for the discovery service...this will force login
            AuthenticationResult result = await GetResourceToken(new Resource() { ServiceResourceId = "Microsoft.SharePoint" });
            
            //make a call to the discovery service to get all resources available to user
            var resourcesJson = await this.GetJson(DISCOVERY_SERVICE_URI, result.AccessToken);

            //parse the results into a generic list of resources stored on the controller
            var oResponse = JObject.Parse(resourcesJson).SelectToken("d.results");
            this.Resources = oResponse.ToObject<List<Resource>>();
            return result;
        }

        /// <summary>
        /// Retrieves a resource-specific access token
        /// </summary>
        /// <param name="resource">the resource to get an access token for</param>
        /// <returns>AuthenticationResult</returns>
        private async Task<AuthenticationResult> GetResourceToken(Resource resource)
        {
            AuthenticationResult result = null;

#if WINDOWS_PHONE_APP
            this.AuthContext = await AuthenticationContext.CreateAsync(String.Format(AUTHORITY, TENANT));
            result = await this.AuthContext.AcquireTokenSilentAsync(resource.ServiceResourceId, CLIENT_ID);
            if (result == null || result.Status != AuthenticationStatus.Success)
            {
                var tcs = new TaskCompletionSource<AuthenticationResult>();
                this.AuthContext.AcquireTokenAndContinue(resource.ServiceResourceId, CLIENT_ID, redirectURI, r =>
                {
                    tcs.SetResult(r);
                });
                result = await tcs.Task;
            }
#else
            this.AuthContext = new AuthenticationContext(String.Format(AUTHORITY, TENANT));
            result = await this.AuthContext.AcquireTokenAsync(resource.ServiceResourceId, CLIENT_ID, redirectURI);
#endif
            return result;
        }

        /// <summary>
        /// Gets all Images from a user's OneDrive for Business site
        /// </summary>
        /// <returns></returns>
        public async Task<ObservableCollection<MyFile>> GetMyImages()
        {
            ObservableCollection<MyFile> results = new ObservableCollection<MyFile>();

            //get MyFiles Resource details
            var myFilesResource = this.Resources.FirstOrDefault(i => i.Capability == ResourceType.MyFiles);
            if (myFilesResource != null)
            {
                //get MyFiles AccessToken
                var accessToken = await this.GetResourceToken(myFilesResource);

                //the /_api/Files endpoint will return ALL files from OneDrive for Business and then we will filter client-side
                var json = await this.GetJson(myFilesResource.ServiceEndpointUri + "/Files", accessToken.AccessToken);

                //parse the json string into an ObservableCollection of MyFile objects
                var jobj = JObject.Parse(json);
                results = jobj.SelectToken("d.results").ToObject<ObservableCollection<MyFile>>();

                //filter out anything that is not an image...we only care about images
                for (int i = results.Count; i > 0; i--)
                {
                    if (!results[i - 1].Name.EndsWith(".jpg", StringComparison.CurrentCultureIgnoreCase) &&
                        !results[i - 1].Name.EndsWith(".png", StringComparison.CurrentCultureIgnoreCase) &&
                        !results[i - 1].Name.EndsWith(".gif", StringComparison.CurrentCultureIgnoreCase))
                        results.RemoveAt(i - 1);
                }
            }

            return results;
        }

        /// <summary>
        /// Performs a GET request to a REST end-point including bearer token in header
        /// </summary>
        /// <param name="url">the REST end-point</param>
        /// <param name="accessToken">the access token</param>
        /// <returns>unparsed json string</returns>
        private async Task<string> GetJson(string url, string accessToken)
        {
            string json = String.Empty;
            HttpClient client = new HttpClient();
            client.DefaultRequestHeaders.Add("Authorization", "Bearer " + accessToken);
            client.DefaultRequestHeaders.Add("Accept", "application/json; odata=verbose");
            List<string> results = new List<string>();
            using (HttpResponseMessage response = await client.GetAsync(new Uri(url, UriKind.Absolute)))
            {
                if (response.IsSuccessStatusCode)
                {
                    json = await response.Content.ReadAsStringAsync();
                }
            }

            return json;
        }

        /// <summary>
        /// Retrieves a binary image and resizes it accordingly
        /// </summary>
        /// <param name="item">MyFile object</param>
        /// <returns>resized BitmapSource</returns>
        public async Task<BitmapSource> GetImage(MyFile item, int w)
        {
            BitmapImage img = new BitmapImage();

            var ar = await this.EnsureClientCreated();
            if (ar != null)
            {
                //get the myFilesResource
                var myFilesResource = this.Resources.FirstOrDefault(i => i.Capability == ResourceType.MyFiles);
                if (myFilesResource != null)
                {
                    //get url parts
                    var relativePath = item.Url.Substring(myFilesResource.ServiceEndpointUri.Length - 4);
                    var folder = relativePath.Substring(0, relativePath.LastIndexOf('/'));

                    //get resource-specific access token and retreive the file
                    var accessToken = await this.GetResourceToken(myFilesResource);
                    HttpClient client = new HttpClient();
                    client.DefaultRequestHeaders.Add("Authorization", "Bearer " + accessToken.AccessToken);
                    client.DefaultRequestHeaders.Add("Accept", "application/json; odata=verbose");
                    List<string> results = new List<string>();
                    //this won't work, but would be nice for using image renditions...instead we will use rest to get full-size image and then resize
                    //using (HttpResponseMessage response = await client.GetAsync(new Uri(item.Url + "?width=100", UriKind.Absolute)))

                    using (HttpResponseMessage response = await client.GetAsync(new Uri(myFilesResource.ServiceEndpointUri + "/web/GetFolderByServerRelativeUrl('" + folder + "')/Files('" + item.Name + "')/$value", UriKind.Absolute)))
                    {
                        if (response.IsSuccessStatusCode)
                        {
                            //use the response stream to resize the image in memory
                            using (var stream = await response.Content.ReadAsStreamAsync())
                            {
                                using (var memStream = new MemoryStream())
                                {
                                    await stream.CopyToAsync(memStream);
                                    memStream.Position = 0;
                                    BitmapDecoder decoder = await BitmapDecoder.CreateAsync(memStream.AsRandomAccessStream());
                                    using (InMemoryRandomAccessStream ras = new InMemoryRandomAccessStream())
                                    {
                                        //first get original specs so we can scale the resize best
                                        BitmapEncoder enc = await BitmapEncoder.CreateForTranscodingAsync(ras, decoder);
                                        await enc.FlushAsync();
                                        BitmapImage original = new BitmapImage();
                                        original.SetSource(ras);
                                        int height = original.PixelHeight;
                                        int width = original.PixelWidth;

                                        //rewind and take a second pass...this time resizing
                                        ras.Seek(0);
                                        enc = await BitmapEncoder.CreateForTranscodingAsync(ras, decoder);
                                        enc.BitmapTransform.ScaledHeight = (uint)(((double)height / (double)width) * w);
                                        enc.BitmapTransform.ScaledWidth = (uint)w;
                                        await enc.FlushAsync();
                                        img.SetSource(ras);
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return img;
        }
    }

    /// <summary>
    /// MyFile class the implements INotifyPropertyChanged for use in observable collections
    /// </summary>
    public class MyFile : INotifyPropertyChanged
    {
        public FileMetadata __metadata { get; set; }
        public UserInformation CreatedBy { get; set; }
        public UserInformation LastModifiedBy { get; set; }
        public string ETag { get; set; }
        public string Id { get; set; }
        public string Name { get; set; }
        public string Url { get; set; }
        public int Size { get; set; }
        public DateTime TimeCreated { get; set; }
        public DateTime TimeLastModified { get; set; }
        private BitmapSource bitmap;
        public BitmapSource Bitmap
        {
            get { return bitmap; }
            set 
            { 
                //set value and raise the property changed event
                bitmap = value;
                OnPropertyChanged("Bitmap");
            }
        }

        public bool ImageLoaded { get; set; }

        public string Icon
        {
            get 
            {
                //get icon based on extension
                if (this.Name.EndsWith(".jpg", StringComparison.CurrentCultureIgnoreCase))
                    return "ms-appx:///assets/app/jpg.png";
                else if (this.Name.EndsWith(".png", StringComparison.CurrentCultureIgnoreCase))
                    return "ms-appx:///assets/app/png.png";
                if (this.Name.EndsWith(".gif", StringComparison.CurrentCultureIgnoreCase))
                    return "ms-appx:///assets/app/gif.png";
                else
                    return "ms-appx:///assets/app/gif.png";
            }
        }

        //INotifyPropertyChanged members
        public event PropertyChangedEventHandler PropertyChanged;
        protected void OnPropertyChanged(string name)
        {
            if (null != PropertyChanged)
            {
                PropertyChanged(this, new PropertyChangedEventArgs(name));
            }
        }
    }

    /// <summary>
    /// File metadata info
    /// </summary>
    public class FileMetadata
    {
        public string id { get; set; }
        public string uri { get; set; }
        public string type { get; set; }
    }

    /// <summary>
    /// User information class
    /// </summary>
    public class UserInformation
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Puid { get; set; }
    }

    /// <summary>
    /// Resource class to be retrived from Discovery Service
    /// </summary>
    public class Resource
    {
        public ResourceType Capability { get; set; }
        public string EntityKey { get; set; }
        public string ProviderId { get; set; }
        public string ProviderName { get; set; }
        public int ServiceAccountType { get; set; }
        public string ServiceEndpointUri { get; set; }
        public string ServiceId { get; set; }
        public string ServiceName { get; set; }
        public string ServiceResourceId { get; set; }
    }

    /// <summary>
    /// Resource Type enum
    /// </summary>
    public enum ResourceType
    {
        MyFiles,
        Contacts,
        Calendar,
        Mail
    }
}