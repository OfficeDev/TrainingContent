# Lab: Build a basic connector that works with Microsoft Graph and Microsoft Teams

In this lab, you will learn the steps to create and send connector cards to Office 365 Groups and Microsoft Teams, and learn the steps for registering a connector with the Office 365 Connectors Developer Dashboard.

## In this lab

1. [Create a card payload and submit it via an incoming webhook](#exercise-1-create-a-card-payload-and-submit-it-via-an-incoming-webhook)
1. [Add functionality to an existing web site](#exercise-2-add-connector-functionality-to-existing-website)
1. [Sideload connector to Microsoft Teams](#exercise-3-sideload-the-connector-to-microsoft-teams)

## Prerequisites

This lab will require an Office 365 tenant and a user account that has a mailbox. The exercises that use Microsoft Teams require additional setup. The tenant setup steps are detailed on the [Getting Started page](https://msdn.microsoft.com/en-us/microsoft-teams/setup). Pay special attention to the sections **Prepare your Office 365 tenant** and **Get started with Teams App Studio**.

### Install developer tools

The developer workstation requires the following tools for this lab:

#### Download ngrok

The connector registration process requires an endpoint accessible from the internet via HTTPS. A tunneling application is required for the exercises to work correctly.

This lab uses [ngrok](https://ngrok.com) for tunneling publicly-available HTTPS endpoints to a web server running locally on the developer workstation without an SSL certificate. ngrok is a single-file download that is run from a console.

#### Code editors

The steps and code samples in this lab use [Visual Studio 2017](https://www.visualstudio.com/) for websites using C#.

## Exercise 1: Create a card payload and submit it via an incoming webhook

In this exercise, you will copy an example card from the Message Card Playground website and send it to an Office 365 group in your tenant.

### Create a group and configure the webhook

1. Open a browser and go to [Microsoft Outlook](https://outlook.office.com). Log in with your Office 365 credentials.
1. Create a new group, or select an existing group.
1. At the top-right of the screen, select the gear next to the member account. Choose **Connectors**.

    ![Screenshot of group settings menu](Images/Exercise1-01.png)

1. In the list of connectors, scroll down and select **Incoming Webhook**. Select **Add**.

    ![Screenshot of list of Connectors with incoming webhook highlighted](Images/Exercise1-02.png)

1. Enter a name for the connector and select **Create**.
1. The page will re-display, now including a URL for the connector. Use the icon next to the URL to copy it to the clipboard.

    ![Screenshot of incoming webhook with URL](Images/Exercise1-03.png)

    > Note: The URL will be used several times in this exercise, as will the clipboard. We recommend pasting the URL into Notepad or other application.

1. Select **Done**. Then close the Connector and Group settings menus.

### Explore MessageCard playground

1. In another browser tab or window, navigate to [MessageCard Playground](https://messagecardplayground.azurewebsites.net).
1. The playground site provides for uploading a custom card definition or reviewing several samples. Use the **select a sample** dropdown to select a sample that closely matches your requirements.

    ![Screenshot of message card sample](Images/Exercise1-04.png)

    > Note: The image in this lab uses the **MessageCard layout emulation**, but that is not required.

### Send card via PowerShell

It is not necessary to use the playground website to send test messages. Any facility for sending HTTP POST requests can also send cards to the group.

1. Select the JSON of a card from teh MessageCard Playground and copy it to Notepad.
1. Save the card source as **connector-card.json**.
1. Open **Windows PowerShell** and change to the directory containing the **connector-card.json** file.
1. Execute the following commands:

    ```powershell
    $message = Get-Content .\connector-card.json
    $url = <YOUR WEBHOOK URL>
    Invoke-RestMethod -ContentType "application/json" -Body $message -Uri $url -Method Post
    ```

    ![Screenshot of PowerShell command](Images/Exercise1-06.png)

    > The `Invoke-RestMethod` cmdlet will return **1** to indicate success.

## Exercise 2: Add connector functionality to existing website

This exercise will add connector functionality to an existing website. First, a new website must be created. The following steps create a default MVC website and walk through the steps for adding a connector. All code can be found in the [Lab Files](./Lab%20Files) folder, which was based on an application with the name **WebApplication1**.

1. Open **Visual Studio 2017**

1. Create a new **ASP.NET Web Application (.NET Framework)** project.

    ![Screenshot of new ASP.NET web application project](Images/Exercise2-01.png)

1. Choose the **MVC** template.

    ![Screenshot of ASP.NET web application template with MVC selected](Images/Exercise2-02.png)

    >Our example will use a subset of the complete solution at [Microsoft Teams Sample Connector in .NET/C#](https://github.com/OfficeDev/microsoft-teams-sample-connector-csharp). This lab will implement enough of that example so that you can create and register the Connector and see it post a welcome message card.

1. Right-click on the **Models** folder and select **Add > Class**.  Name the class **Subscription**.

1. Paste the following code inside the `Subscription` public class.

    ````csharp
    public string GroupName { get; set; }
    public string WebHookUri { get; set; }
    ````

1. Add a new folder to the project and name it **Repository**.

1. Right-click on the **Repository** folder and select **Add > Class**. Name the class **SubscriptionRepository**.

1. Paste the following code into the file, adjusting the namespaces as necessary for your project name.

    ````csharp
    using System.Collections.Generic;
    using WebApplication1.Models;

    namespace WebApplication1.Repository
    {
        public class SubscriptionRepository
        {
            public static List<Subscription> Subscriptions { get; set; } = new List<Subscription>();
        }
    }
    ````

1. Add a new folder to the project and name it **Utils**.

1. Right-click on the **Utils** folder and select **Add > Class**. Name the class **TaskHelper**.

1. Paste the following code into the file, adjusting the namespaces as necessary for your project name.

    ````csharp
    using System.Net.Http;
    using System.Net.Http.Headers;
    using System.Threading.Tasks;

    namespace WebApplication1.Utils
    {
        public class TaskHelper
        {
            public static async Task PostWelcomeMessage(string webhook, string channelName)
            {
                string cardJson = @"{
                ""@type"": ""MessageCard"",
                ""summary"": ""Welcome Message"",
                ""sections"": [{
                    ""activityTitle"": ""Welcome Message"",
                    ""text"": ""The ToDo connector has been set up. We will send you notification whenever new task is added.""}]}";

                await PostCardAsync(webhook, cardJson);
            }

            private static async Task PostCardAsync(string webhook, string cardJson)
            {
                //prepare the http POST
                HttpClient client = new HttpClient();
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                var content = new StringContent(cardJson, System.Text.Encoding.UTF8, "application/json");
                using (var response = await client.PostAsync(webhook, content))
                {
                    // Check response.IsSuccessStatusCode and take appropriate action if needed.
                }
            }
        }
    }
    ````

1. Right-click on the **Controllers** folder and select **Add > Controller**. Select **MVC 5 Controller - Empty**. Name the controller **ConnectorController**.

1. Paste the following code into the file, adjusting the namespaces as necessary for your project name.

    ````csharp
    using System;
    using System.Threading.Tasks;
    using System.Web.Mvc;
    using WebApplication1.Models;
    using WebApplication1.Repository;
    using WebApplication1.Utils;

    namespace WebApplication1.Controllers
    {
        public class ConnectorController : Controller
        {
            /// <summary>
            /// This is the landing page when user tries to setup the connector.
            /// You could implement login here, if required.
            /// </summary>
            public ViewResult Setup()
            {
                return View();
            }

            /// <summary>
            /// This endpoint is called when registration is completed.
            /// This contains GroupName and Webhook Url which can be used to push change notifications to the channel.
            /// </summary>
            /// <returns></returns>
            public async Task<ActionResult> Register()
            {
                var error = Request["error"];
                var state = Request["state"];
                if (!String.IsNullOrEmpty(error))
                {
                    return RedirectToAction("Error"); // You could pass error message to Error Action.
                }
                else
                {
                    var group = Request["group_name"];
                    var webhook = Request["webhook_url"];

                    Subscription subscription = new Subscription();
                    subscription.GroupName = group;
                    subscription.WebHookUri = webhook;

                    // Save the subscription so that it can be used to push data to the registered channels.
                    SubscriptionRepository.Subscriptions.Add(subscription);

                    await TaskHelper.PostWelcomeMessage(webhook, group);

                    return View();
                }
            }

            // Error page
            public ActionResult Error()
            {
                return View();
            }
        }
    }
    ````

1. Place your cursor inside the **Setup** method, right-click and select **Add > View**. Clear the check box for **Use a layout page**.

1. Paste the following code into the file.

    >Note: the link below has two placeholders that we will be replacing later in this lab.  [ApplicationID] and [NGROK_HTTPS]

    ````html
    @{
        Layout = null;
    }
    <H2>Register your channel for Task Notification</H2>
    <p>
        Select the button to call the "register" endpoint in the sample app, which will register the Connector for the selected channel.
    </p>
    <a href="https://outlook.office.com/connectors/Connect?state=myAppsState&app_id=[ApplicationID]&callback_url=[NGROK_HTTPS]/connector/register">
        <img src="https://o365connectors.blob.core.windows.net/images/ConnectToO365Button.png" alt="Connect to Office 365"></img>
    </a>
    ````

1. Place your cursor inside the **Register** method, right-click and select **Add > View**. Clear the checkbox for **Use a layout page**.

1. Paste the following code into the file.

    ````html
    @{
        Layout = null;
    }

    <H2>Registration successful!</H2>
    ````

1. Place your cursor inside the **Error** method, right-click and select **Add > View**. Clear the checkbox for **Use a layout page**.

1. Paste the following code into the file.

    ````html
    @{
        Layout = null;
    }

    <!DOCTYPE html>

    <html>
    <head>
        <meta name="viewport" content="width=device-width" />
        <title>Error</title>
    </head>
    <body>
        <hgroup>
            <h1 class="text-danger">Error.</h1>
            <h2 class="text-danger">An error occurred while processing your request.</h2>
        </hgroup>
    </body>
    </html>
    ````

1. Press **F5** to build and run the project. Verify that the setup page is available by appending `/connector/setup` to the localhost URL. In this example `http://localhost:20455/connector/setup`.

    ![Screenshot of setup page](Images/Exercise2-03.png)

1. Stop debugging.

### Run the ngrok secure tunnel application

1. Choose the **csproj** file and select **F4** to display the Properties pane.

1. Make note of the **URL** property. It is needed for the tunnel application later.

    >Note: If this were a real solution you would want to enable SSL Encryption (by changing the value to true) because the connector requires it.  During testing ngrok is handling the HTTPS->HTTP redirection.

    ![Screenshot of project URL](Images/Exercise2-04.png)

1. Open a new **Command Prompt** window.

1. Change to the directory that contains the ngrok.exe application.

1. Run the command `ngrok http [port] -host-header=localhost`. Replace `[port]` with the port portion of the URL noted above, in this example `20455`.

1. The ngrok application will fill the entire prompt window. Make note of the forwarding address using HTTPS. This address is required in the next step.

    ![Screenshot of ngrok command prompt](Images/Exercise2-05.png)

1. Minimize the ngrok Command Prompt window. It is no longer referenced in this lab, but it must remain running.

### Register the connector

Following the steps found on [docs.microsoft.com](https://docs.microsoft.com/en-us/outlook/actionable-messages/connectors-dev-dashboard#build-your-own-connector), register a connector for Office 365. Make sure you are using an account that has access to Microsoft Outlook to test later.

1. Fill in all the basic details such as name and description for the new connector.

1. For the **Landing page for your users for Inbox** and **Landing page for your users for Groups or Teams** field, use the forwarding HTTPS address from ngrok prepended to the route to the setup endpoint. In the example, this is `https://8555a1a2.ngrok.io/connector/setup`.

1. For the **Redirect URLs** field, use the forwarding HTTPS address from ngrok prepended to the route to the register endpoint. In the example, this is `https://8555a1a2.ngrok.io/connector/register`.

1. Agree to the terms and conditions and choose **Save**.

1. The registration page URL's query string will contain the **id** of the connector. Further, a **Copy Snippet** button is available that will copy the registration 'button' HTML code to your clipboard. You already have the HTML, so you can modify it by hand. Make note of the **id** query string parameter as you will use in the following steps. In addition, when you sideload the connector into Microsoft Teams in [Exercise 3](#exercise3), you will make use of the **Download Manifest** feature.

    ![Screenshot of Connectors Developer Dashboard with the Connector ID highlighted](Images/Exercise2-06.png)

### Modify the register view to include the connector ID and ngrok HTTPS URL

1. Return to Visual Studio, with the web project created earlier opened. Stop the debugger.

1. Open the `/Views/Connector/Setup.cshtml` file.

1. Modify the **Register Office365** button's HTML to include the Connector ID and ngrok HTTPS URL from above. The **ID** replaces `[ApplicationID]` and the ngrok HTTPS URL replaces `[NGROK_HTTPS]`. For example:

    ````html
    <a href="https://outlook.office.com/connectors/Connect?state=myAppsState&app_id=a64a31c1-5901-4af0-98cd-1c98ba42ba39&callback_url=https://8555a1a2.ngrok.io/connector/register">
        <img src="https://o365connectors.blob.core.windows.net/images/ConnectToO365Button.png" alt="Connect to Office 365"></img>
    </a>
    ````

### Add the connector to your inbox

1. Run the web application.

1. In a separate browser tab or window, open [Microsoft Outlook](https://outlook.office365.com).  Make sure you are logged in with the same account that you used to register the connector.

1. In a separate browser tab navigate to the HTTPS setup URL. In the example, this is `https://8555a1a2.ngrok.io/connector/setup`.

1. Choose the **Connect to Office 365** button.

1. Select **Inbox** and then choose **Allow**.  You should then be redirected to the register endpoint and see the **Registration Successful** message.

    ![Screenshot of Connect to Office 365 prompt](Images/Exercise2-08.png)

1. Return to your Microsoft Outlook inbox and you will see the Welcome message card.

    ![Screenshot of welcome message from Connector](Images/Exercise2-09.png)

This completes Exercise 2.

## Exercise 3: Sideload the Connector to Microsoft Teams

To complete this part of the lab, the prerequisites for developing Apps for Microsoft Teams must be completed. The setup steps are detailed on the [Getting Started page](https://msdn.microsoft.com/en-us/microsoft-teams/setup). Pay special attention to the sections **Prepare your Office 365 tenant** and **Use Teams App Studio**.

### Sideload app into Microsoft Teams

Side loading a Microsoft Teams Connector requires a zip file containing a manifest that describes the connector along with related resources.

1. From the connector setup page, select the **Download Manifest** button which will download the manifest.json file to your machine.

1. Open the manifest.json file in an editor and replace the `icons` section with the following json and save the file.

    ````json
    "icons": {
      "outline": "connector-icon-20x20.png",
      "color": "connector-icon-96x96.png"
    },
    ````

1. Add the manifest.json plus the `Lab Files/Teams/connector-icon-20x20.png` and `Lab Files/Teams/connector-icon-96x96.png` to a zip file. In this demo, the zip file is named **TeamsConnector.zip**.

1. In the Microsoft Teams application, select the **Create a team** link. Then select the **Create team** button.

    ![Screenshot of Microsoft Teams](Images/Exercise3-01.png)

1. Enter a team name and description. In this example, the team is named **Connector Team**. Select **Next**.

1. Optionally, invite others from your organization to the team. This step can be skipped in this lab.

1. The new team is shown. In the left-side panel, select the ellipses next to the team name. Choose **Manage team** from the context menu.

    ![Screenshot of Microsoft Teams menu with Manage team highlighted](Images/Exercise3-02.png)

1. On the Manage Team display, select **Apps** in the tab strip. Then select the **Upload a custom app** link at the bottom right corner of the application. Navigate to the folder where the **TeamsConnector.zip** file is and select it.

    ![Screenshot of Microsoft Teams Apps screen with Upload a custom app highlighted](Images/Exercise3-03.png)

1. The app is displayed.

    ![Screenshot of apps in Microsoft Teams](Images/Exercise3-04.png)

The Connector is now sideloaded into the Microsoft Teams application.

### Add connector to a channel

1. Make sure your application is running.

1. Select the ellipses next to the channel name, then select **Connectors**.

    ![Screenshot of channel menu with connectors highlighted](Images/Exercise3-05.png)

1. Scroll to the bottom of the connector list. A section named **Sideloaded** contains the connector described by the manifest. Select **Configure**.

    ![Screenshot of connectors list in Microsoft Teams](Images/Exercise3-06.png)

1. A dialog window is shown with the general and notification information described on the Connector Developer portal. Select the **Visit site to install** button.

    ![Screenshot of information dialog in Microsoft Teams](Images/Exercise3-07.png)

1. Choose the **Connect to Office 365** button. Office 365 will process the registration flow. You will see the **Registration Successful** notice.  Close this window and select **Done**.

1. The conversation window of the channel will now show the Welcome Message card that was sent via the API.

    ![Screenshot of conversation window in Microsoft Teams with message card](Images/Exercise3-08.png)

This completes Exercise 3.