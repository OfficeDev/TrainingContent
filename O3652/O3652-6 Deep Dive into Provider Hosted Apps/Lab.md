# Deep Dive into Provider Hosted Apps
In this lab, you will create a Provider-Hosted app and make use of some of the advanced capabilities.

## Prerequisites
1. You must have an Office 365 tenant to complete this lab. If you do not have one, the lab for **O3651-7 Setting up your Developer environment in Office 365** shows you how to obtain a trial.

## Exercise 1: Create a Provider-Hosted App 
In this exercise you create a new provider-hosted app.

1. Create the new project in Visual Studio 2013:
  1. Launch **Visual Studio 2013** as administrator. 
  2. In Visual Studio select **File/New/Project**.
  3. In the New Project dialog:
    1. Select **Templates/Visual C#/Office/SharePoint/Apps**.
    2. Click **App for SharePoint 2013**.
    3. Name the new project **DeepDiveCloudApp** and click **OK**.<br/>
       ![Screenshot of the previous step](Images/01.png?raw=true "Figure 1")
  4. In the New App for SharePoint wizard:
    1. Enter the address of a SharePoint site to use for testing the app (***NOTE:*** The targeted site must be based on a Developer Site template)
    2. Select **Provider-Hosted** as the hosting model.
    3. Click **Next**.<br/>
       ![Screenshot of the previous step](Images/02.png?raw=true "Figure 2")
    4. Select **ASP.NET Web Forms Application**.
    5. Click **Next**.<br/>
       ![Screenshot of the previous step](Images/03.png?raw=true "Figure 3")
    6. Select the option labeled **Use Windows Azure Access Control Service (for SharePoint cloud apps)**.
    7. Click **Finish**.<br/>
       ![Screenshot of the previous step](Images/04.png?raw=true "Figure 4")
    8. When prompted, log in using your O365 administrator credentials.
    9. Open **Default.aspx.cs** from the **DeepDiveCloudAppWeb** project.
    10. **Delete** the code that is used to obtain the host web title so your code appears as follows:<br/> 
       ![Screenshot of the previous step](Images/05.png?raw=true "Figure 5")
 
## Exercise 2: Chrome Control 
In this exercise you will add the Chrome Control to the project you created in Exercise 1.

1. Open **DeepDiveCloudApp.sln** in Visual Studio 2013 if not already open.
2. Rich click the **DeepDiveCloudAppWeb** project and select **Add/New Folder**.
3. Name the new folder **Images**.
4. Copy the file **AppIcon.png** from the **DeepDiveCloudApp** project into the **Images** folder.
5. Right click the **Pages** folder in the **DeepDiveCloudAppWeb** project and select **Add/New/Web Form**.
6. Name the new Web Form **CrossDomain**.
7. Click **OK**.
8. Add a div element to the body of the page to hold the Chrome Control. The following code shows the div in context with the body.
    ```HTML
    <body>
        <form id="form1" runat="server">
        <div id="chrome_ctrl_placeholder"></div>
        <div> 
        
        </div>
        </form>
    </body>
    ```
9. Open **Default.aspx** from the **DeepDiveCloudAppWeb** project.
10. Add a div element to the body of the page to hold the Chrome Control. The following code shows the div in context with the body.
    ```HTML
    <body>
        <form id="form1" runat="server">
        <div id="chrome_ctrl_placeholder"></div>
        <div>
    
        </div>
        </form>
    </body>
    ```
11. Right click the **Scripts** folder and select **Add/New/JavaScript File**.
12. Name the new file **app**.
13. Click **OK**.
14. **Add** the following code to **app.js** to initialize the Chrome Control.
    ```javascript
    "use strict";

    var ChromeControl = function () {

        var init = function () {
    
            var hostWebUrl = queryString("SPHostUrl");
            $.getScript(hostWebUrl + "/_layouts/15/SP.UI.Controls.js", render);

        },

        render = function () {
            var options = {
                "appIconUrl": "../Images/AppIcon.png",
                "appTitle": "Deep Dive Cloud App",
                "settingsLinks": [
                    {
                        "linkUrl": "../Pages/CrossDomain.aspx?" + document.URL.split("?")[1],
                        "displayName": "Cross Domain Library"
                    }
                ]
            };
    
            var nav = new SP.UI.Controls.Navigation(
                                    "chrome_ctrl_placeholder",
                                    options
                              );
            nav.setVisible(true);

        },

        queryString = function (p) {
            var params =
                document.URL.split("?")[1].split("&");
            var strParams = "";
            for (var i = 0; i < params.length; i = i + 1) {
                var singleParam = params[i].split("=");
                if (singleParam[0] == p)
                    return decodeURIComponent(singleParam[1]);
            }
        }

        return {
            init: init,
        }
    }();


    (function () {
        "use strict";

        jQuery(function () {
            ChromeControl.init();
        });

    }());
    ```
15. Open **Default.aspx** from the **DeepDiveCloudAppWeb** project.
16. Add the following script references in the **head** section.
    ```javascript
    <script src="../Scripts/jquery-1.9.1.js"></script>
    <script src="../Scripts/app.js"></script>
    ```
17. Open **CrossDomain.aspx** from the **DeepDiveCloudAppWeb** project.
18. Add the following script references in the **head** section.
    ```javascript
    <script src="../Scripts/jquery-1.9.1.js"></script>
    <script src="../Scripts/app.js"></script>
    ```
19. Press **F5** to debug your app.
20. Verify that the Chrome Control appears and that you can navigate between the Default.aspx and crossDomain.aspx pages.<br/>
       ![Screenshot of the previous step](Images/06.png?raw=true "Figure 6")

## Exercise 3: Cross-Domain Library 
In this exercise you use the cross-domain library to access a list in the app web.

1. Open **DeepDiveCloudApp.sln** in Visual Studio 2013 if not already open.
2. Right click the **DeepDiveCloudApp** project and select **Add/New Item**.
3. In the **Add New Item** dialog, select **List**.
4. name the new list **Terms**.
5. Click **Add**.<br/>
       ![Screenshot of the previous step](Images/07.png?raw=true "Figure 7")
6. In the **SharePoint Customization Wizard**, select **Create list instance based on existing list template**.
7. Select **Custom List**.
8. Click **Finish**.<br/>
       ![Screenshot of the previous step](Images/08.png?raw=true "Figure 8")
9. Open the **Elements.xml** file associated with the new list instance **DeepDiveCloudApp/Terms/Elements.xml**.
10. Add the following XML inside the **ListInstance** element to pre-populate the list with data.

    ```xml

        <Data>
          <Rows>
            <Row>
              <Field Name="Title">SharePoint-Hosted App</Field>
            </Row>
            <Row>
              <Field Name="Title">Provider-Hosted App</Field>
            </Row>
            <Row>
              <Field Name="Title">Microsoft Azure</Field>
            </Row>
            <Row>
              <Field Name="Title">Office 365</Field>
            </Row>
            <Row>
              <Field Name="Title">SharePoint Online</Field>
            </Row>
          </Rows>
        </Data>

    ```

11. Right click the **Scripts** folder in the **DeepDiveCloudAppWeb** project and select **Add/New/JavaScript File**.
12. Name the new file **crossdomain**.
13. Click **OK**.
14. **Add** the following code to **crossdomain.js** to read the Terms list items.
    ```javascript

    (function () {
        "use strict";

        jQuery(function () {
 
            //Get Host and App web URLS
            var appWebUrl = "";
            var spHostUrl = "";
            var args = window.location.search.substring(1).split("&");

            for (var i = 0; i < args.length; i++) {
                var n = args[i].split("=");
                if (n[0] == "SPHostUrl")
                    spHostUrl = decodeURIComponent(n[1]);
            }

            for (var i = 0; i < args.length; i++) {
                var n = args[i].split("=");
                if (n[0] == "SPAppWebUrl")
                    appWebUrl = decodeURIComponent(n[1]);
            }

            //Load Libraries
            var scriptbase = spHostUrl + "/_layouts/15/";

            jQuery.getScript(scriptbase + "SP.RequestExecutor.js", function (data) {

                //Call Host Web with REST
                var executor = new SP.RequestExecutor(appWebUrl);
                executor.executeAsync({
                    url: appWebUrl + "/_api/web/lists/getbytitle('Terms')/items",
                    method: "GET",
                    headers: { "accept": "application/json;odata=verbose" },
                    success: function (data) {

                        var results = JSON.parse(data.body).d.results;
                        for (var i = 0; i < results.length; i++) {
                            $("#termList").append("<li>" + results[i].Title + "</li>");
                        }
                    },
                    error: function () {
                        alert("Error!");
                    }
                });

            });

        });

    }());
    ```
15. Open **CrossDomain.aspx** from the **DeepDiveCloudAppWeb** project.
16. Add the following script reference in the **head** section.
    ```javascript
    <script src="../Scripts/crossdomain.js"></script>
    ```
17. Add an unordered list element to display the terms. The list element is shown in context below.
    ```HTML
    <body>
    <form id="form1" runat="server">
        <div id="chrome_ctrl_placeholder"></div>
        <div>
            <ul id="termList"></ul>
        </div>
    </form>
    </body>
    ```
18. Press **F5** to debug the app.
19. Use the Chrome Control navigation element to open the **Cross-Domain Library** page.<br/>
       ![Screenshot of the previous step](Images/09.png?raw=true "Figure 9")

**Congratulations! You have completed creating a Provider-Hosted app that uses the Chrome Control and Cross-Domain Library.**

