# Getting started with Office 365 APIs
In this lab, you will investigate the O365 APIs.

## Prerequisites
1. You must have an Office 365 tenant to complete this lab. If you do not have one, the lab for **O3651-7 Setting up your Developer environment in Office 365** shows you how to obtain a trial.

## Exercise 1: Obtain the  Office 365 API Tools
In this exercise you install the Office 365 API Tools in Visual Studio.

1. Start **Visual Studio 2013**.
2. Click **Tools/Extensions and Updates**.
  1. In the **Extensions and Updates" dialog, click **Online**.
  2. Click **Visual Studio Gallery**.
  3. Type **Office 365** in the search box.
  4. Click **Office 365 API Tools - Preview**.
  5. Click **Install**.<br/>
     ![](Images/01.png?raw=true "Figure 1")

## Exercise 2: Create an MVC Web Application
In this exercise you will create a new MVC web application to utilize the O365 APIs.

1. In Visual Studio, click **Flie/New/Project**.
2. In the **New Project** dialog
  1. Select **Templates/Visual C#/Web**.
  2. Select **ASP.NET Web Application**.<br/>
     ![](Images/02.png?raw=true "Figure 2")
  3. Click **OK**.
3. In the **New ASP.NET Project** dialog
  1. Click **MVC**.
  2. Click **Change Authentication**.
  3. Select **No Authentication**.
  4. Click **OK**.
  5. Click **OK**.<br/>
     ![](Images/03.png?raw=true "Figure 3")
4. In the **Solution Explorer**, right click the project and select **Add/Connected Service**.
5. In the **Services Manager** dialog
  1. Click **Register Your App**.
  2. When prompted sign in with your **Organizational Account**.
  3. Click **Calendar**.
  4. Click **Permissions**.
  5. Check **Read User's Calendar**.
  6. Click **Apply**.
  7. Click **OK**.<br/>
     ![](Images/04.png?raw=true "Figure 4")
6. In the **Solution Explorer**, open the file **CalendarApiSample.cs**.
  1. **Delete** the following lines of code. These values need to be stored in session state to prevent needless round trip for authentication.
  ```C#
        // Do not make static in Web apps; store it in session or in a cookie instead
        static string _lastLoggedInUser;
        static DiscoveryContext _discoveryContext;
  ```
  2. **Replace** the code in the **EnsureClientCreated** method with the following code.
  ```C#
            DiscoveryContext _discoveryContext = System.Web.HttpContext.Current.Session["DiscoveryContext"] as DiscoveryContext;

            if (_discoveryContext == null)
            {
                _discoveryContext = await DiscoveryContext.CreateAsync();
                System.Web.HttpContext.Current.Session["DiscoveryContext"] = _discoveryContext;

            }

            var dcr = await _discoveryContext.DiscoverResourceAsync(ServiceResourceId);

            System.Web.HttpContext.Current.Session["LastLoggedInUser"] = dcr.UserId;

            return new ExchangeClient(ServiceEndpointUri, async () =>
            {
                return (await _discoveryContext.AuthenticationContext.AcquireTokenByRefreshTokenAsync(new SessionCache().Read("RefreshToken"), new Microsoft.IdentityModel.Clients.ActiveDirectory.ClientCredential(_discoveryContext.AppIdentity.ClientId, _discoveryContext.AppIdentity.ClientSecret), ServiceResourceId)).AccessToken;
            });
  ```
  3. **Replace** the code in the **SignOut** method with the following code.
```C#
            DiscoveryContext _discoveryContext = System.Web.HttpContext.Current.Session["DiscoveryContext"] as DiscoveryContext;

            if (_discoveryContext == null)
            {
                _discoveryContext = new DiscoveryContext();
                System.Web.HttpContext.Current.Session["DiscoveryContext"] = _discoveryContext;
            }

            _discoveryContext.ClearCache();

            return _discoveryContext.GetLogoutUri<SessionCache>(postLogoutRedirect);

```
7. Open the **HomeController.cs** class.
  1. Add the following code to the top of the file
  ```C#
  using System.Threading.Tasks;
  using Microsoft.Office365.Exchange;
  using Microsoft.Office365.OAuth;
  ```
  2. Modify the **Index** method to appear as follows
  ```C#
        public async Task<ActionResult> Index()
        {
            try
            {
                IOrderedEnumerable<IEvent> events = await CalendarAPISample.GetCalendarEvents();
                ViewBag.Events = events;
            }
            catch (RedirectRequiredException x)
            {
                return Redirect(x.RedirectUri.ToString());
            }
            return View();
        }
  ```
  3. Right click within the **Index** method and select **Go To View**.
  4. Replace the contents of the view with the following code
  ```HTML
    @{
        ViewBag.Title = "Home Page";
    }

    <div>
    <table>
        <thead>
        <th>Subject</th>
        <th>Start</th>
        <th>End</th>
        @foreach (var Event in ViewBag.Events)
        {
            <tr>
                <td>
                    <div style="width:200px;">@Event.Subject</div>
                </td>
                <td>
                    <div style="width:200px;">@Event.Start</div>
                </td>
                <td>
                    <div style="width:200px;">@Event.End</div>
                </td>
            </tr>
        }
    </table>
    </</div>
  ```
5. Run the application by pushing **F5**.
6. Verify that events appear in the web application.


**Congratulations! You have completed your first Office 365 API application.**




