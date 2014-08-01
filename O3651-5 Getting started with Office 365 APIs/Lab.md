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
  1. Click **Sign In**.
  2. Click **Calendar**.
  3. Click **Permissions**.
  4. Check **Read User's Calendar**.
  5. Click **Apply**.
  6. Click **OK**.<br/>
     ![](Images/04.png?raw=true "Figure 4")
6. In the **Solution Explorer**, open the file **CalendarApiSample.cs**.
  1. Examine the **GetCalendarEvents** method, which is used to retrieve events from the user's calendar.
  2. Examine the **EnsureClientCreated** method, which is used to manage to app authorization.
7. Open the **HomeController.cs** class.
  1. Add the following code to the top of the file
  ```
  using Microsoft.Office365.Exchange;
  using System.Threading.Tasks;
  ```
  2. Modify the **Index** method to appear as follows
  ```
        public async Task<ActionResult> Index()
        {
            IOrderedEnumerable<IEvent> events = await CalendarAPISample.GetCalendarEvents();
            ViewBag.Events = events;
            return View();
        }
  ```
  3. Right click within the **Index** method and select **Go To View**.
  4. Replace the contents of the view with the following code
  ```
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




