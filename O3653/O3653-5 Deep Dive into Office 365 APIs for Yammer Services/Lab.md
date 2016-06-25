# Office 365 APIs for Yammer Services
In this lab, you will use the Office 365 APIs for to read and write social data to your Yammer networks.

## Prerequisites
1. You must have an Office 365 tenant and Windows Azure subscription to complete this lab. If you do not have one, the lab for **O3651-7 Setting up your Developer environment in Office 365** shows you how to obtain a trial.
2. You must have your default social experience set to Yammer for your Office 365 tenant. This was accomplished in the lab for **O3651-7 Setting up your Developer environment in Office 365**. Note that it can take up to 30 minutes to change the SharePoint social experience.
3. You must have created and joined a Yammer network with your Organizational account at https://www.yammer.com/msacademy.onmicrosoft.com/?show_signup=true.

## Exercise 1: Yammer code, app parts, and apps in SharePoint online
In this exercise, you will add Yammer code, web parts amd apps to your SharePoint site.

1. Log into Yammer and get the feed embed information.
  1. Navigate to Yammer [https://www.yammer.com] and log in with your **Organizational Account**.<br/>
       ![Screenshot of the previous step](Images/01.png?raw=true "Figure 1")
  2. Click the **All Company** group.
  3. In the **Access Options** click **Embed this group in your site**.<br/>
       ![Screenshot of the previous step](Images/02.png?raw=true "Figure 2")
  4. Copy the code and save it for use later.<br/>
       ![Screenshot of the previous step](Images/03.png?raw=true "Figure 3")
2. Embed a Yammer feed into SharePoint online.
  1. Log into your SharePoint online site with your **Organizational Account**.
  2. Place the home page in **Edit** mode.<br/>
       ![Screenshot of the previous step](Images/04.png?raw=true "Figure 4")
  3. Click **Insert/Embed Code**.<br/>
       ![Screenshot of the previous step](Images/05.png?raw=true "Figure 5")
  4. Paste the code you copied from Yammer.
  5. Click **Insert**.
  6. Verify the Yammer feed displays.
3. Use the Yammer web part.
  1. Click **Site Contents**.
  2. Click **Add an App**.
  3. Click **SharePoint Store**.
  4. Type **Yammer App for SharePoint** in the search box and search the available apps.
  5. Click on the **Yammer App for SharePoint** app.
  6. Click **Add It**.
  7. Click **Trust It**.
  8. Go to the home page of your SharePoint site.
  9. CLick **Insert/App Part**.<br/>
       ![Screenshot of the previous step](Images/06.png?raw=true "Figure 6")
  10. Select the **Yammer Feed** app part.
  11. Click **Add**.<br/>
       ![Screenshot of the previous step](Images/07.png?raw=true "Figure 7")
  12. Click **Home Feed**. <br/>
       ![Screenshot of the previous step](Images/08.png?raw=true "Figure 8")
  13. Enter your **network** name.
  14. Click  **Save**.<br/>
       ![Screenshot of the previous step](Images/09.png?raw=true "Figure 9")
  15. Save the changes to the home page.
4. Use the Social Nucleus app.
  1. Click **Site Contents**.
  2. Click **Add an App**.
  3. Click **SharePoint Store**.
  4. Type **Nucleus** in the search box and search the available apps.<br/>
       ![Screenshot of the previous step](Images/10.png?raw=true "Figure 10")
  5. Click on the **Social Nucleus** app.
  6. Click **Add It**.<br/>
       ![Screenshot of the previous step](Images/11.png?raw=true "Figure 11")
  7. Click **Trust It**.<br/>
       ![Screenshot of the previous step](Images/12.png?raw=true "Figure 12")
  8. When the app installs, launch it.
  9. Pick **Yammer** as your social platform for the app.<br/>
       ![Screenshot of the previous step](Images/13.png?raw=true "Figure 13")
  10. If prompted, log into Yammer with your **Organizational Account**.
  11. Use the app to navigate your relationships in Yammer.

## Exercise 2: JavaScript SDK
In this exercise, you will use the Yammer JavaScript SDK to search Yammer data.

1. Create a new ASP.NET Web Forms application.
  1. Start **Visual Studio 2013**.
  2. Select **File/New/Project**.
  3. In the **New Project** dialog, select **Templates/Visual C#/Web**.
  4. Name the new project **YammerSDKApp**.
  5. Click **OK**.<br/>
       ![Screenshot of the previous step](Images/16.png?raw=true "Figure 16")
  6. In the **New ASP.NET Project** dialog:
    1. Click **Web Forms**.
    2. Click **Change Authentication**.
    3. Select **No Authentication**.
    4. Click **OK**.<br/>
       ![Screenshot of the previous step](Images/17.png?raw=true "Figure 17")
    5. Click **OK**.<br/>
       ![Screenshot of the previous step](Images/18.png?raw=true "Figure 18")
  7. In the **Solution Explorer**, click the **YammerSDKApp** project and note the value of the **URL** in the **Properties** window. Save this value for later when you register a new app with Yammer.
2. Register a new app
  1. Open a browser to https://www.yammer.com/client_applications
  2. Click **Register New App**.<br/>
       ![Screenshot of the previous step](Images/14.png?raw=true "Figure 14")
  3. Fill out the form with information about the new app.
  4. Click **Continue**.<br/>
       ![Screenshot of the previous step](Images/15.png?raw=true "Figure 15")
  5. Copy the **Client ID** and save it for later use.
  6. Click **Basic Info**.
  7. Enter the URL of the **YammerSDKApp** you saved earlier into the **Redirect URI** field.
  8. Also, enter the URL of the **YammerSDKApp** you saved earlier into the **JavaScript Origins** field.
  8. Click **Save**.<br/>
 3. Build the authentication code.
  1. In the **Solution Explorer**, double click **Default.aspx** to open the file.
  2. **Replace** the code in the **BodyContent** placeholder with the following:
  ```HTML
    <div style="margin: 50px">
        <div class="row">
            <div class="col-md-12">
                <span id="yammer-login"></span>
            </div>
        </div>
    </div>
  ```
  3. In the **Solution Explorer**, right click the **Scripts** folder and select **Add/JavaScript File**.
  4. Name the new file **App.js**.
  5. Click **OK**.
  6. **Add** the following code to support the Yammer login button.
  ```javascript
  yam.connect.loginButton("#yammer-login", function (response) {

      if (response.authResponse) {
          $("#yammer-login").text("Welcome to Yammer!");
      }
      else {
          $("#yammer-login").text("Not logged in.");
      }

  });

  ```
  7. In the **Solution Explorer**, right click the **Site.Master**.
  8. **Add** the following script references just before the closing **head** tag.
  ```javascript
    <script type="text/javascript" data-app-id="YOUR CLIENT ID" src="https://c64.assets-yammer.com/assets/platform_js_sdk.js"></script>
    <script src="Scripts/App.js"></script>

  ```
4. Test the login functionality.

> NOTE: Internet Explorer places Yammer.com URLs in the Intranet zone by default. This can cause log in failures if your app is in a different zone. For this exercise, either place Yammer.com in the Trusted zone or use a browser, like Chrome, that does not have security zones.

  1. Press **F5** to debug your application.
  2. When the application starts, click **Login with Yammer**.
  3. Click **Allow**.<br/>
       ![Screenshot of the previous step](Images/19.png?raw=true "Figure 19")
  4. Verify that you receive the "Welcome to Yammer!" message.
  5. Stop debugging.
5. Build the Search Code
  1. In the **Solution Explorer**, double click **Default.aspx** to open the file.
  2. **Add** the following code inside the main div in the **BodyContent** placeholder:
  ```HTML
    <div class="row">
        <div class="col-md-4"></div>
        <div class="col-md-2">
            <input type="text" id="searchText" />
        </div>
        <div class="col-md-2">
            <input type="button" id="searchButton" value="Search Yammer" />
        </div>
        <div class="col-md-4"></div>
    </div>
    <div class="row" id="searchResults">
    </div>

  ```
  3. **Add** the following code to the **App.js** file to perform search:
  ```javascript
  jQuery(function () {

    $("#searchButton").click(function () {

        yam.getLoginStatus(function (response) {

            if (response.authResponse) {

                yam.platform.request({
                    url: "https://api.yammer.com/api/v1/search.json",
                    method: "GET",
                    data: {
                        "search": $("#searchText").val(),
                        "page": 1,
                        "num_per_page": 20
                    },
                    success: function (data) {
                        $("#searchResults").html("<div class='col-md-12'><h3>Search Results</h3></div>");
                        for (var i = 0; i < data.messages.messages.length; i++) {
                            $("#searchResults").append("<div class='col-md-12'>" + data.messages.messages[i].body.rich + "</div>");
                        }
                    },
                    error: function (err) {
                        alert(JSON.stringify(err));
                    }
                })

            }
            else {
                alert("You are logged out of Yammer");
            }

        });

    });

  });


  ```
6. Test the search functionality.
  1. Press **F5** to debug your application.
  2. Enter a search term.
  3. Click **Search Yammer**.
  4. Verify that results are returned.

## Exercise 3: OpenGraph Protocol
In this exercise, you will create an application that uses the OpenGraph protocol to create activities in Yammer.

1. Create a new ASP.NET Web Forms application.
  1. Start **Visual Studio 2013**.
  2. Select **File/New/Project**.
  3. In the **New Project** dialog, select **Templates/Visual C#/Web**.
  4. Name the new project **YammerOGApp**.
  5. Click **OK**.<br/>
       ![Screenshot of the previous step](Images/20.png?raw=true "Figure 20")
  6. In the **New ASP.NET Project** dialog:
    1. Click **Web Forms**.
    2. Click **Change Authentication**.
    3. Select **No Authentication**.
    4. Click **OK**.<br/>
       ![Screenshot of the previous step](Images/21.png?raw=true "Figure 21")
    5. Click **OK**.<br/>
       ![Screenshot of the previous step](Images/22.png?raw=true "Figure 22")
  7. In the **Solution Explorer**, click the **YammerOGApp** project and note the value of the **URL** in the **Properties** window. Save this value for later when you register a new app with Yammer.
  8. Right click the **References** node and select **Add Reference**.
  9. Add references to the following assemblies:
  ```C#
  System.Runtime.Serialization
  System.Net.Http
  ```
2. Register a new app
  1. Open a browser to https://www.yammer.com/client_applications
  2. Click **Register New App**.
  3. Fill out the form with information about the new app.
  4. Click **Continue**.
  5. Copy the **Client ID** and save it for later use.
  6. Click **Basic Info**.
  7. Enter the URL of the **YammerOGApp** you saved earlier into the **Redirect URI** field.
  8. Click **Save**.
3. Code the Yammer Authentication
  1. In the **Solution Explorer**, open **Default.aspx** for editing.
  2. In the **Page** directive, **add** the **Async** attribute to support asynchronous operations as shown<br/>
       ![Screenshot of the previous step](Images/23.png?raw=true "Figure 23")
  3. In the **Solution Explorer**, open **Default.aspx.cs** for editing.
  4. **Add** the following **using** statements at the top of the file:
  ```C#
  using System.Text;
  using System.Xml;
  using System.Xml.Linq;
  using System.Runtime.Serialization.Json;
  using System.Net.Http;
  using System.Net.Http.Headers;
  ```
  5. **Add** the following constants to the top of the class file.
  ```C#
        public const string ClientId = "YOUR APP CLIENT ID";
        public const string RedirectUri = "YOUR APP REDIRECT URI";
        public const string ClientSecret = "YOUR APP SECRET";

  ```
  6. **Add** the following helper functions
  ```C#
        private static XElement Json2Xml(string json)
        {
            using (XmlDictionaryReader reader = JsonReaderWriterFactory.CreateJsonReader(
                Encoding.UTF8.GetBytes(json),
                XmlDictionaryReaderQuotas.Max))
            {
                return XElement.Load(reader);
            }

        }

        public static void SaveInCache(string name, object value)
        {
            System.Web.HttpContext.Current.Session[name] = value;
        }

        public static object GetFromCache(string name)
        {
            return System.Web.HttpContext.Current.Session[name];
        }

        public static void RemoveFromCache(string name)
        {
            System.Web.HttpContext.Current.Session.Remove(name);
        }
  ```
  7. **Replace** the **Page_Load** method with the following code to retrieve an access token when the application starts.
  ```C#
        protected async void Page_Load(object sender, EventArgs e)
        {
            if (!Page.IsPostBack)
            {
                string accessToken = null;
                try
                {
                    accessToken = GetFromCache("AccessToken").ToString();
                }
                catch
                {
                    accessToken = null;
                }

                if (accessToken == null)
                {
                    string code = Request.QueryString["code"];

                    if (code == null)
                    {
                        Response.Redirect(
                            String.Format("https://www.yammer.com/dialog/oauth?client_id={0}&redirect_uri={1}",
                            ClientId, RedirectUri), false);
                    }
                    else
                    {

                        string requestUri = String.Format(
                            "https://www.yammer.com/oauth2/access_token.json?client_id={0}&client_secret={1}&code={2}",
                            ClientId, ClientSecret, code);


                        HttpClient client = new HttpClient();
                        HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Get, requestUri);
                        request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                        HttpResponseMessage response = await client.SendAsync(request);
                        XElement root = Json2Xml(await response.Content.ReadAsStringAsync());
                        accessToken = root.Descendants("token").First().Value;
                        SaveInCache("AccessToken", accessToken);
                    }
                }

            }
        }

  ```
4. Code the creation of a new activity.
  1. In the **Solution Explorer**, open **Default.aspx** for editing.
  2. **Replace** all of the content in the **BodyContent** with the following code:
  ```HTML
    <div style="margin: 50px">
        <div class="form-horizontal">
            <div class="form-group">
                <div class="col-md-2">Actor Name</div>
                <div class="col-md-10">
                    <asp:TextBox ID="actorName" runat="server" Width="250" Text="Your name" />
                </div>
            </div>
            <div class="form-group">
                <div class="col-md-2">Actor E-mail</div>
                <div class="col-md-10">
                    <asp:TextBox ID="actorEmail" runat="server" Width="250" Text="Your e-mail" />
                </div>
            </div>
            <div class="form-group">
                <div class="col-md-2">Message</div>
                <div class="col-md-10">
                    <asp:TextBox ID="activityMessage" runat="server" Width="250" Text="Check out this great video on Microsoft Virtual Academy" />
                </div>
            </div>
            <div class="form-group">
                <div class="col-md-2">Object URL</div>
                <div class="col-md-10">
                    <asp:TextBox ID="objectUrl" runat="server" Width="250" Text="http://www.microsoftvirtualacademy.com/training-courses/introduction-to-office-365-development" />
                </div>
            </div>
            <div class="form-group">
                <div class="col-md-2">Object Title</div>
                <div class="col-md-10">
                    <asp:TextBox ID="objectTitle" runat="server" Width="250" Text="Introduction to Office 365 Development" />
                </div>
            </div>
            <div class="form-group">
                <div class="col-md-offset-2 col-md-10">
                    <asp:Button ID="createActivity" runat="server" CssClass="btn btn-default" Text="Create Activity" OnClick="createActivity_Click" />
                </div>
            </div>
        </div>
    </div>

  ```
  3. Right click the **YammerOGApp** project and select **Add/Class**.
  4. Name the new class **ActivityEnvelope.cs**.
  5. **Add** the following **using** statements to the top of the file
  ```C#
  using System.IO;
  using System.Runtime.Serialization;
  using System.Runtime.Serialization.Json;
  ```
  6. **Replace** the class definition with the following code that defines the appropriate JSON message for adding an activity using the OpenGraph protocol.
  ```C#
    [DataContract]
    public class ActivityEnvelope
    {

        public ActivityEnvelope()
        {
            Activity = new Activity();
        }

        [DataMember(Name = "activity")]
        public Activity Activity { get; set; }

        public string GetJSON()
        {
            MemoryStream ms = new MemoryStream();
            DataContractJsonSerializer s = new DataContractJsonSerializer(typeof(ActivityEnvelope));
            s.WriteObject(ms, this);
            ms.Position = 0;
            StreamReader sr = new StreamReader(ms);
            return sr.ReadToEnd();
        }
    }
    [DataContract(Name = "activity")]
    public class Activity
    {
        public Activity()
        {
            Actor = new Actor();
            Action = YammerOGApp.Action.create.ToString();
            OG_Object = new OG_Object();
            Message = string.Empty;
            users = new List<Actor>();
        }
        private List<Actor> users;

        [DataMember(Name = "actor")]
        public Actor Actor { get; set; }

        [DataMember(Name = "action")]
        public string Action { get; set; }

        [DataMember(Name = "object")]
        public OG_Object OG_Object { get; set; }

        [DataMember(Name = "message")]
        public string Message { get; set; }

        [DataMember(Name = "actors")]
        public Actor[] Users
        {
            get { return users.ToArray(); }
            set { users = value.ToList<Actor>(); }
        }

    }
    [DataContract(Name = "actor")]
    public class Actor
    {
        public Actor()
        {
            
            Name = string.Empty;
            Email = string.Empty;
        }

        [DataMember(Name = "name")]
        public string Name { get; set; }

        [DataMember(Name = "email")]
        public string Email { get; set; }
    }

    [DataContract(Name = "object")]
    public class OG_Object
    {

        public OG_Object()
        {
            Url = string.Empty;
            Title = string.Empty;
        }

        [DataMember(Name = "url")]
        public string Url { get; set; }

        [DataMember(Name = "title")]
        public string Title { get; set; }
    }
    public enum Action
    {
        create,
        update,
        delete,
        follow,
        like
    }

  ```
  7. In the **Solution Explorer**, open **Default.aspx.cs** for editing.
  8. **Add** the following code to post the new activity
  ```C#
        protected async void createActivity_Click(object sender, EventArgs e)
        {
            string accessToken = GetFromCache("AccessToken").ToString();

            string requestUri = "https://www.yammer.com/api/v1/activity.json";

            HttpClient client = new HttpClient();
            HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Post, requestUri);
            request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

            ActivityEnvelope envelope = new ActivityEnvelope();
            envelope.Activity.Actor.Name = actorName.Text;
            envelope.Activity.Actor.Email = actorEmail.Text;
            envelope.Activity.Action = "create";
            envelope.Activity.Message = activityMessage.Text;
            envelope.Activity.OG_Object.Title = objectTitle.Text;
            envelope.Activity.OG_Object.Url = objectUrl.Text;
                
            string json = envelope.GetJSON();

            StringContent requestContent = new StringContent(json);
            request.Content = requestContent;
            request.Content.Headers.ContentType = new MediaTypeHeaderValue("application/json");

            HttpResponseMessage response = await client.SendAsync(request);
            XElement root = Json2Xml(await response.Content.ReadAsStringAsync());

        }

  ```
5. Test the application.
  1. Start **Fiddler** to trace the calls made by your app.
  2. In **Visual Studio 2013**, press **F5** to start debugging your app.
  3. When the application starts, look for the call to the **access_token.json** endpoint in Fiddler.
  4. Review the response to see the returned access token.<br/>
       ![Screenshot of the previous step](Images/24.png?raw=true "Figure 24")
  5. Edit the form data in the application to use your name and your Yammer e-mail account.
  6. Click **Create Activity**.<br/>
       ![Screenshot of the previous step](Images/25.png?raw=true "Figure 25")
  7. When the post completes, look for the call to the **activity.json** endpoint in Fiddler.
  8. Review the request to see the activity data.<br/>
       ![Screenshot of the previous step](Images/26.png?raw=true "Figure 26")
  9. Log into https://www.yammer.com
  10. Examine your **Recent Activity** to see the new activity post.<br/>
       ![Screenshot of the previous step](Images/27.png?raw=true "Figure 27")
  11. Hover over the activity and open it from the link in the corresponding flyout.

Congratulations! You have completed working with the Yammer APIs.



