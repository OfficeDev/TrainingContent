# Demo - Section 3:  Microsoft Teams Apps with multiple capabilities

To run this demo, perform the following steps from the lab:

## Download NuGet packages

1. Launch Visual Studio 2017 as an administrator
1. Build the solution to download all configured NuGet packages.

## Configure URL

1. In Solution Explorer, double-click on **Properties**
1. In the Properties designer, select the **Web** tab.
1. Note the Project URL.

    ![](../../Images/Exercise1-02.png)

### Run the ngrok secure tunnel application

1. Open a new **Command Prompt** window.
1. Change to the directory that contains the ngrok.exe application.
1. Run the command `ngrok http [port] -host-header=localhost:[port]` (Replace [port] with the port portion of the URL noted above.)
1. The ngrok application will fill the entire prompt window. Make note of the Forwarding address using https. This address is required in the next step.
1. Minimize the ngrok Command Prompt window. It is no longer referenced in this lab, but it must remain running.

    ![](../../Images/Exercise1-03.png)

### Register the bot ###

1. Go to the Microsoft Bot Framework portal at https://dev.botframework.com and sign in. (The bot registration portal accepts a Work or School Account or a Microsoft Account.)
1. Click **Register**. (If the Register button is not shown, click **My bots** in the top navigation.)
1. Complete the Bot profile section, entering a Display name, Bot handle and description.

    ![](../../Images/Exercise1-04.png)

1. Complete the Configuration section.
    1. For the Messaging endpoint, use the Forwarding https address from ngrok prepended to the route to the MessagesController in the Visual Studio project. In the example, this is `https://a2632edd.ngrok.io/API/Messages`.
    1. Click the **Create Microsoft App ID and password button**. This opens a new browser tab/window.
    1. In the new browser tab/window the application is registered in Azure Active Directory. Click **Generate an app password to continue**.
    1. An app password is generated. Copy the password and save it. You will use it in a subsequent step.
    1. Click **OK**. This closes the popup.
    1. Click the **Finish and go back to Bot Framework** button. This closes the new browser tab/window and populates the app Id in the **Paste your app ID below to continue textbox**.

        ![](../../Images/Exercise1-05.png)

1. Scroll to the bottom of the page. Agree to the Privacy statement, Terms of use, and Code of conduct and click the **Register** button. Once the Bot is created, click **OK** to dismiss the pop-up.

    The **Connect to channels** page is displayed for the newly-created bot. The bot must be connected to Microsoft Teams.

1. Click the Teams logo.

    ![](../../Images/Exercise1-06.png)

1. Once the connection is complete, ensure the connection is **Enabled** and click **Done**

    ![](../../Images/Exercise1-07.png)

The bot registration is complete.

### Office 365 Connector registration

The following steps are used to register an Office 365 Connector.

1. Register the Connector on the [Connectors Developer Dashboard](https://go.microsoft.com/fwlink/?LinkID=780623). Log on the the site and click **New Connector**.
1. On the **New Connector** page:

    1. Complete the Name and Description as appropriate for your demo.

        ![](../../Images/Exercise3-05.png)

    1. In the Events/Notifications section the list of events are displayed when registering the Connector in the Teams user inteface on a consent dialog. The Connector framework will only allow cards sent by your connector  to have **Actions URLs** that match what is provided here.

        ![](../../Images/Exercise3-06.png)

    1. The **Landing page for your users for Groups or Teams** is a URL that is rendered by the Microsoft Teams Application when users initiate the registration flow from a channel. This page is rendered in a popup provided by Teams. The **Redirect URLs** is a list of valid URLs to which the completed registration information can be sent. This functionality is similar to the Redirect URL processing for Azure Active Directory apps.

        For this lab, ensure that the hostname matches the ngrok forwarding address. For the landing page, append `/api/connector/landing` to the hostname. For the redirect page, append `/api/connector/redirect` to the hostname.

        ![](../../Images/Exercise3-07.png)

    1. In the **Enable this integration for** section, both **Group** and **Microsoft Teams** must be selected.

        ![](../../Images/Exercise3-08.png)

    1. Agree to the terms and conditions and click **Save**

1. The registration page will refresh with additional buttons in the integration section. The buttons provide sample code for the **Landing** page and a `manifest.json` file for a Teams app. **Save both of these assets.**

### Configure the web project

The bot project must be configured with information from the registration.

1. In Visual Studio, open the `Web.config` file. Locate the `<appSettings>` section.
1. Enter the `BotId` value. the `BotId` is the **Bot handle** from the **Configuration** section of the registration.
1. Enter the `MicrosoftAppId`. The `MicrosoftAppId` is the app ID from the **Configuration** section of the registration.
1. Enter the `MicrosoftAppPassword`. The `MicrosoftAppPassword` is the auto-generated app password displayed in the pop-up during registration.

    > If you do not have the app password, the bot must be deleted and re-registered. An app password cannot be reset nor displayed.

### Configure Visual Studio to Package bot

Packaging a bot for Microsoft Teams requires that a manifest file (and related resources) are compressed into a zip file and added to a team.

1. Open the `manifest.json` file in the `Manifest` folder.

    The `manifest.json` file requires several updates:
    - The `id` property must contain the app ID from registration. Replace the token `[microsoft-app-id]` with the app ID.
    - The `packageName` property must contain a unique identifier. The convention is to use the bot's URL in reverse format. Replace the token `[from-ngrok]` with the unique identifier from the Forwarding address.
    - Similarly, the `developer` property has three URLs that should match the hostname of the Messaging endpoint. Replace the token `[from-ngrok]` with the unique identifier from the Forwarding address.
    - The `botId` property (in the `bots` collection property) also requires the app ID from registration. Replace the token `[microsoft-app-id]` with the app ID.
    - Replace the empty `connectors` node in the `manifest.json` file with the `connectors` node from the manifest downloaded from the Connector registration.
    - Save and close the `manifest.json` file.
1. Press **Ctrl+Shift+B** to build the project. The build will create a zip file in the build output folder (bin\\).

## Start the demo

### Sideload app into Microsoft Teams

1. In the Microsoft Teams application, in the left-side panel, click the ellipses next to the team name. Choose **View team** from the context menu.

    ![](../../Images/Exercise1-12.png)

1. On the View team display, click **Apps** in the tab strip. Then click the **Sideload an app** link at the bottom right corner of the application.
1. Select the zip file (**teams-bot1.zip** in this example) from the `bin` folder. Click **Open**.
1. The app is displayed. Notice information about the app from the manifest (Description and Icon) is displayed.

    ![](../../Images/Exercise1-13.png)

The app is now sideloaded into the Microsoft Teams application and the bot is available.

All members of the team should get a 1:1 message.

### Add Connector to a channel

1. Click **...** next to the channel name, then select **Connectors**.

    ![](../../Images/Exercise3-01.png)

1. Scroll to the bottom of the connector list. A section named **Sideloaded** contains the Connector described by the app.. Click **Configure**

    ![](../../Images/Exercise3-09.png)

1. An information dialog is shown with the general and notification information described on the Connector Developer portal. Click the **Visit site to install** button.

    ![](../../Images/Exercise3-10.png)

1. Click the **Connect to Office 365** button. Office 365 will process the registration flow, which may include login and Team/Channel selection. Make note of teh selected Teamd-Channel and click **Allow**.

    ![](../../Images/Exercise3-12.png)

1. The dialog will display the **Redirect** action which presents the information registration provided by Office 365. In a production application, this information must be presisted and used to sent notifications to the channel.

    ![](../../Images/Exercise3-13.png)

    > Note: Before your Connector can receive callbacks for actionable messages, you must register it and publish the app.
