# Messaging Extension

In this demo, you will send post a message in a channel regarding a candidate using a messaging extension.

## Prerequisites

Developing apps for Microsoft Teams requires preparation for both the Office 365 tenant and the development workstation.

For the Office 365 Tenant, the setup steps are detailed on the [Prepare your Office 365 Tenant page](https://docs.microsoft.com/en-us/microsoftteams/platform/get-started/get-started-tenant).

### Azure Subscription

The Azure Bot service requires an Azure subscription. A free trial subscription is sufficient.

### Download ngrok

As Microsoft Teams is an entirely cloud-based product, it requires all services it accesses to be available from the cloud using HTTPS endpoints. To enable the exercises to work within Microsoft Teams, a tunneling application is required.

This lab uses [ngrok](https://ngrok.com) for tunneling publicly-available HTTPS endpoints to a web server running locally on the developer workstation. ngrok is a single-file download that is run from a console.

## Update Demo solution

Make the following updates to the demo solution.

1. Launch Visual Studio 2017 as an administrator.

1. In Visual Studio 2017, select **File > Open > Project/Solution**.

1. Select the **officedev-talent-management.sln** file from the **Demos\02-messaging-extension** folder.

### Find the project URL

1. In Solution Explorer, double-click on **Properties**.

1. In the properties designer, select the **Web** tab.

1. Note the project URL.

    ![Screenshot of Solution Explorer highlighting project URL.](../../Images/Exercise1-02.png)

### Run the ngrok secure tunnel application

1. Open a new **Command Prompt** window.

1. Change to the directory that contains the **ngrok.exe** application.

1. Run the command `ngrok http [port] -host-header=localhost:[port]`. Replace `[port]` with the port portion of the URL noted above.

1. The ngrok application will fill the entire prompt window. Make note of the forwarding address using HTTPS. This address is required in the next step.

1. Minimize the ngrok command prompt window. It is no longer referenced in this lab, but it must remain running.

    ![Screenshot of ngrok command prompt with local host highlighted.](../../Images/Exercise1-03.png)

### Register the bot

1. Open the [Azure Portal](https://portal.azure.com).

1. Select **Create a resource**.

1. In the **Search the marketplace** box, enter `bot`.

1. Choose **Bot Channels Registration**

1. Select the **Create** button.

1. Complete the **Bot Channels Registration** blade. For the **Bot name**, enter a descriptive name.

1. Enter the following address for the **Messaging endpoint**. Replace the token `[from-ngrok]` with the forwarding address displayed in the ngrok window.

    ```
    https://[from-ngrok].ngrok.io/api/Messages
    ```

1. Allow the service to auto-create an application.

1. Select **Create**.

1. When the deployment completes, navigate to the resource in the Azure portal. In the left-most navigation, select **All resources**. In the **All resources** blade, select the Bot Channels Registration.

    ![Screenshot of bot channel registration.](../../Images/Exercise1-04.png)

1. In the **Bot Management** section, select **Channels**.

    ![Screenshot of channel menu with Microsoft Teams icon highlighted.](../../Images/Exercise1-05.png)

1. Click on the Microsoft Teams logo to create a connection to Teams. Select **Save**. Agree to the Terms of Service.

    ![Screenshot of MSTeams bot confirmation page.](../../Images/Exercise1-06.png)

#### Record the Bot Channel Registration Bot Id and secret

1. In the **Bot Channels Registration** blade, select **Settings** under **Bot Management**

1. The **Microsoft App Id** is displayed. Record this value.

1. Next to the **Microsoft App Id**, select the **Manage** link. This will open the Application Registration Portal in a new tab. If prompted, select the button titled **View the app in the Azure Portal".

1. In the application blade, select **Certificates & Secrets**.

1. Select **New client secret**.

1. Enter a description and select an expiration interval. Select **Add**.

1. A new secret is created and displayed. Record the new secret.

    ![Screenshot of application registration.](Images/Exercise1-07.png)

### Configure the web project

The bot project must be configured with information from the registration.

1. In **Visual Studio**, open the **Web.config** file. Locate the `<appSettings>` section.


1. Enter the `MicrosoftAppId` from the **Configuration** section of the registration.

1. Enter the `MicrosoftAppPassword`, the auto-generated app password displayed in the dialog box during registration.

    > **Note:** If you do not have the app password, the bot must be deleted and re-registered. An app password cannot be reset nor displayed.

1. Open the **manifest.json** file just added to the project. The `manifest.json` file requires several updates:
    - The `id` property must contain the app ID from registration. Replace the token `[microsoft-app-id]` with the app ID.
    - The `packageName` property must contain a unique identifier. The industry standard is to use the bot's URL in reverse format. Replace the token `[from-ngrok]` with the unique identifier from the forwarding address.
    - The `developer` property has three URLs that should match the hostname of the Messaging endpoint. Replace the token `[from-ngrok]` with the unique identifier from the forwarding address.
    - The `botId` property in the `bots` collection property also requires the app ID from registration. Replace the token `[microsoft-app-id]` with the app ID.
    - Save and close the **manifest.json** file.

1. Press **F5** to build the solution and package and start the web service in the debugger. The debugger will start the default browser, which can be ignored. The next step uses the teams client.

### Upload app into Microsoft Teams

Although not strictly necessary, in this lab the bot will be added to a new team.

1. In the Microsoft Teams application, select the **Add team** link. Then select the **Create team** button.

    ![Screenshot of Microsoft Teams with Create Team button highlighted.](../../Images/Exercise1-11.png)

1. Enter a team name and description. In this example, the team is named **teams-bot-1**. Select **Next**.

1. Optionally, invite others from your organization to the team. This step can be skipped in this lab.

1. The new team is shown. In the left-side panel, select the ellipses next to the team name. Choose **Manage team** from the context menu.

    ![Screenshot of Microsoft Teams with Manage Team highlighted.](../../Images/Exercise1-12.png)

1. On the Manage team display, select **Apps** in the tab strip. Then select the **Upload a custom app** link at the bottom right corner of the application.

1. Select the zip file from the **bin** folder that represents your app. Select **Open**.

1. The app is displayed. The description and icon for the app is displayed.

    ![Screenshot of Microsoft Teams with new app displayed.](../../Images/Exercise1-13.png)

    The app is now uploaded into the Microsoft Teams application and the bot is available.

    > **Note:** Adding the bot to a team invokes the system message **ConversationUpdated**. The code in `MessageHelpers.cs` determines if the message is in response to the bot being added, and initiates a 1:1 message with each member of the team.

    ![Screenshot of Microsoft Teams displaying new bot installed.](../../Images/Exercise1-14.png)

The bot is now installed and ready to run.

## Send a message using the messaging Extension

The messaging extension must be invoked in a channel due to the scopes entered in the manifest.

1. The extension is invoked by selecting the **ellipsis** below the compose box and selecting the bot.

    ![Screenshot of Microsoft Teams messaging extension.](../../Images/Exercise2-03.png)

1. The `initialRun` property of a command  is set to true, so Microsoft Teams will issue a command immediately when the extension is opened.

    ![Screenshot of messaging extension with prepopulated results.](../../Images/Exercise2-04.png)

1. Selecting an item in the messaging extension will populate the message compose area the result. The user can then augment the message.

    ![Screenshot of Microsoft Teams message compose area with extension result shown.](../../Images/Exercise2-05.png)

1. Show the `MessagesController` class. Highlight the code block at lines 44-52 that determine if the activity represents a messaging extension request. Point out that this code block returns the messaging extension results in the body of the response (line 51). This is different than other operations performed by the bot, which simply return a status (line 58).

1. Review the `MessagingExtensionHelper.cs` file, pointing out the code used to respond to messaging extension requests.
