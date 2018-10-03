# Lab - Tabs and Connectors

In this lab, you will walk through extending a Microsoft Teams app with Tabs and Connectors.

## In this lab

- [Tabs](#exercise1)
- [Connectors](#exercise2)

## Prerequisites

Developing apps for Microsoft Teams requires preparation for both the Office 365 tenant and the development workstation.

For the Office 365 Tenant, the setup steps are detailed on the [Getting Started page](https://msdn.microsoft.com/en-us/microsoft-teams/setup). Note that while the getting started page indicates that the Public Developer Preview is optional, this lab includes steps that are not possible unless the preview is enabled.

### Install developer tools

The developer workstation requires the following tools for this lab.

#### Download ngrok

As Microsoft Teams is an entirely cloud-based product, it requires all services it accesses to be available from the cloud using HTTPS endpoints. To enable the exercises to work within Microsoft Teams, a tunneling application is required.

This lab uses [ngrok](https://ngrok.com) for tunneling publicly-available HTTPS endpoints to a web server running locally on the developer workstation. ngrok is a single-file download that is run from a console.

#### Code editors

Tabs in Microsoft Teams are HTML pages hosted in an iframe. The pages can reference CSS and JavaScript like any web page in a browser. Connectors are implemented via a web service, running server-side code.

You can use any code editor or IDE that supports these technologies, however the steps and code samples in this training use [Visual Studio 2017](https://www.visualstudio.com/).

### Starter solution

The exercises in this lab will extend the Microsoft Teams app built in the module [01 - Bots, Messaging Extensions and Cards](../01%20Bots%2C%20Messaging%20Extensions%20and%20Cards). A working copy of that application is in the **LabFiles\Starter** folder.

If you completed module 1, then you may skip ahead to [Exercise 1 - Tabs](#exercise1)

## Update Starter solution

1. Launch Visual Studio 2017 as an administrator.

1. In Visual Studio 2017, select **File > Open > Project/Solution**.

1. Select the **officedev-talent-management.sln** file from the **LabFiles\Starter** folder.

### Find the project URL

1. In Solution Explorer, double-click on **Properties**.

1. In the properties designer, select the **Web** tab.

1. Note the project URL.

    ![Screenshot of Solution Explorer highlighting project URL.](./Images/Starter-01.png)

### Run the ngrok secure tunnel application

1. Open a new **Command Prompt** window.

1. Change to the directory that contains the **ngrok.exe** application.

1. Run the command `ngrok http [port] -host-header=localhost:[port]`. Replace `[port]` with the port portion of the URL noted above.

1. The ngrok application will fill the entire prompt window. Make note of the forwarding address using HTTPS. This address is required in the next step.

1. Minimize the ngrok command prompt window. It is no longer referenced in this lab, but it must remain running.

    ![Screenshot of ngrok command prompt with local host highlighted.](./Images/Starter-02.png)

### Register the bot

1. Go to the [Microsoft Bot Framework](https://dev.botframework.com/bots/new) and sign in. The bot registration portal accepts a work or school account or a Microsoft account.

> **NOTE:** You must use this link to create a new bot: https://dev.botframework.com/bots/new. If you select the **Create a bot button** in the Bot Framework portal instead, you will create your bot in Microsoft Azure instead.

1. Complete the **bot profile section**, entering a display name, unique bot handle and description.

    ![Screenshot of bot profile information page.](./Images/Starter-03.png)

1. Complete the configuration section.
    - For the Messaging endpoint, prepend the forwarding HTTPS address from ngrok  to the route to the `MessagesController` in the Visual Studio project. In the example, this is `https://52bfb8b1.ngrok.io/API/Messages`.
    - Select the **Create Microsoft App ID and password button**. This opens a new browser window.
    - In the new browser window, the application is registered in Azure Active Directory. Select **Generate an app password to continue**.
    - An app password is generated. Copy the password and save it. You will use it in a subsequent step.
    - Select **OK** to close the dialog box.
    - Select the **Finish and go back to Bot Framework** button to close the new browser window and populate the app ID in the **Paste your app ID below to continue textbox**.

        ![Screenshot of configuration page with messaging endpoint and app ID displayed.](./Images/Starter-04.png)

1. Move to the bottom of the page. Agree to the privacy statement, terms of use and code of conduct and select the **Register** button. Once the bot is created, select **OK** to dismiss the dialog box. The **Connect to channels** page is displayed for the newly-created bot.

> **Note:** The Bot migration message (shown in red) can be ignored for Microsoft5 Teams bots. Additional information can be found in the Microsoft Teams developer documentation, on the [Create a bot page](https://docs.microsoft.com/en-us/microsoftteams/platform/concepts/bots/bots-create#bots-and-microsoft-azure).

1. The bot must be connected to Microsoft Teams. Select the **Microsoft Teams** logo.

    ![Screenshot of Microsoft Bot Framework with Microsoft Teams logo highlighted.](./Images/Starter-05.png)

1. Once the connection is complete, ensure the connection is enabled and select **Done**. The bot registration is complete.

    ![Screenshot of Microsoft Bot Framework with configuration message displayed.](./Images/Starter-06.png)

    >**Note:** Selecting **Settings** in the top navigation will re-display the profile and configuration sections. This can be used to update the messaging endpoint in the event ngrok is stopped, or the bot is moved to staging & production.

### Configure the web project

The bot project must be configured with information from the registration.

1. In **Visual Studio**, open the **Web.config** file. Locate the `<appSettings>` section.

1. Enter the `BotId`. The `BotId` is the **Bot handle** from the **Configuration** section of the registration.

1. Enter the `MicrosoftAppId` from the **Configuration** section of the registration.

1. Enter the `MicrosoftAppPassword`, the auto-generated app password displayed in the dialog box during registration.

    > **Note:** If you do not have the app password, the bot must be deleted and re-registered. An app password cannot be reset nor displayed.

1. In the **Manifest** folder , open the **manifest.json** file. The `manifest.json` file requires several updates:
    - The `id` property must contain the app ID from registration. Replace the token `[microsoft-app-id]` with the app ID.
    - The `packageName` property must contain a unique identifier. The industry standard is to use the bot's URL in reverse format. Replace the token `[from-ngrok]` with the unique identifier from the forwarding address.
    - The `developer` property has three URLs that should match the hostname of the Messaging endpoint. Replace the token `[from-ngrok]` with the unique identifier from the forwarding address.
    - The `botId` property in the `bots` collection property also requires the app ID from registration. Replace the token `[microsoft-app-id]` with the app ID.
    - Save and close the **manifest.json** file.

1. Press **F5** to build the solution and package and start the web service in the debugger. The debugger will start the default browser, which can be ignored. The next step uses the teams client.

### Upload app into Microsoft Teams

Although not strictly necessary, in this lab the bot will be added to a new team.

1. In the Microsoft Teams application, click the **Add team** link. Then click the **Create team** button.

    ![Screenshot of Microsoft Teams with Create Team button highlighted.](Images/Starter-07.png)

1. Enter a team name and description. Select **Next**.

1. Optionally, invite others from your organization to the team. This step can be skipped in this lab.

1. The new team is shown. In the left-side panel, select the ellipses next to the team name. Choose **Manage team** from the context menu.

    ![Screenshot of Microsoft Teams with Manage Team highlighted.](Images/Starter-08.png)

1. On the Manage team display, select **Apps** in the tab strip. Then select the **Upload a custom app** link at the bottom right corner of the application.

1. Select the zip file from the **bin** folder that represents your app. Select **Open**.

1. The app is displayed. The description and icon for the app is displayed.

    ![Screenshot of Microsoft Teams with new app displayed.](Images/Starter-09.png)

    The app is now uploaded into the Microsoft Teams application and the bot is available.

    > **Note:** Adding the bot to a team invokes the system message **ConversationUpdated**. The code in `MessageHelpers.cs` determines if the message is in response to the bot being added, and initiates a 1:1 message with each member of the team.

    ![Screenshot of Microsoft Teams displaying new bot installed.](Images/Exercise1-14.png)

The app is now installed. The following exercises will extend this app.

## Exercise 1: Tabs

1. Ensure that the following pre-requisites are complete:
    - The updated starter solution or the solution from module 1 is open in Visual Studio 2017.

    - The ngrok secure tunnel application is running with the correct local URL.

    - The bot has been registered.

    - The app has been uploaded to Microsoft Teams.

1. In Visual Studio right-click on the project, choose **Add > New Folder**. Name the folder Tabs.

1. Add the displayed files from the **Lab Files** folder of this repository.

    ![Screenshot of Solution Explorer with manifest folder displayed.](Images/Exercise1-01.png)

1. Open the **candidates.html** file in the **Tabs** folder.

1. Add the following tag within the `<head>` tag in the file. This script will initialize the Teams JavaScript API and then get the Teams context object. The UPN of the current user is extracted from the context and displayed on the page.

    ```js
    <script>
      $(document).ready(function () {
        microsoftTeams.initialize();
        microsoftTeams.getContext(function (context) {
          $('#hiring-manager-upn').text(context.upn);
        });
      });
    </script>
    ```

1. Open the **channelconfig.html** file in the **Tabs** folder.

1. Add the following tag within the `<head>` tag in the file. This script will perform the following required steps for tab configuration:
    - Initialize the Microsoft Teams Library.
    - Set the 'Save' Button state based on the field content.
    - Register a function as the Save Handler
    - Set the Microsoft Teams settings for the tab, including th url of the content page and the Entity Id for the tab.

    ```javascript
    <script type="text/javascript">
      $(document).ready(function () {

        // These are the variables that decide what tab configuration to save
        var host = `https://${window.location.hostname}`;
        var name = '';
        var posting = '';
        var entity = '';
        var url = '';
        var websiteUrl = '';
        var context;

        // Initialize the Microsoft Teams Library
        microsoftTeams.initialize();

        // Set the 'Save' Button state based on name field content
        $('#name').on('input', function () {
          if ($('#name').val().length != 0) {
            microsoftTeams.settings.setValidityState(true);
          }
          else {
            microsoftTeams.settings.setValidityState(false);
          }
        });

        // Save handler when user clicked on Save button
        microsoftTeams.settings.registerOnSaveHandler(function (saveEvent) {
          microsoftTeams.getContext(function (context) {
            name = $('#name').val();
            posting = $('#posting').val();

            url = `${host}/Tabs/channeltab.html?teamId=` +
              `${encodeURIComponent(context.teamId)}` +
              `&channelId=${encodeURIComponent(context.channelId)}` +
              `&posting=${encodeURIComponent(posting)}`;

            websiteUrl = url + `&web=1`;

            entity = `candidatetab-${name}-${context.teamId}-${context.channelId}`;

            microsoftTeams.settings.setSettings({
              entityId: entity,
              contentUrl: url,
              suggestedDisplayName: name,
              websiteUrl: websiteUrl
            });

            saveEvent.notifySuccess();
          });
        });
      }
    </script>
    ```

1. Open the **manifest.json** file in the **Manifest** folder.

1. Locate the `composeExtensions` node fo the **manifest.json** file. Add the following node as a sibling (at the same level) as the `composeExtensions` node. Replace the token `[from-ngrok]` with the unique identifier from the forwarding address from the ngrok tunnel application.

    ```json
    "staticTabs": [
      {
        "entityId": "candidatesTab",
        "name": "Candidates",
        "contentUrl": "https://[from-ngrok].ngrok.io/Tabs/candidates.html",
        "websiteUrl": "https://[from-ngrok].ngrok.io/Tabs/candidates.html?web=1",
        "scopes": [
          "personal"
        ]
      }
    ],
    "configurableTabs": [
      {
        "configurationUrl": "https://[from-ngrok].ngrok.io/Tabs/channelconfig.html",
        "canUpdateConfiguration": true,
        "scopes": [
          "groupchat",
          "team"
        ]
      }
    ],
    ```

1. Locate the `validDomains` node in the **manifest.json**. Ensure that the host from the ngrok forwarding address is included in the `validDomains` node. (Do not enter the URI scheme, only the host. For example: `ab29ba51.ngrok.io`).

1. Press **F5** to compile, create the package and start the debugger. Since the manifest file has changed, the app must be re-uploaded to Microsoft Teams.

### Remove and upload app

1. In the left-side panel of Microsoft Teams, select the ellipses next to the team name. Choose **Manage team** from the context menu.

    ![Screenshot of Microsoft Teams with Manage Team highlighted.](Images/Starter-08.png)

1. On the Manage team display, select **Apps** in the tab strip. Locate app in the list and select the trash can icon on the right.

    ![Screenshot of Microsoft Teams highlighting the trash can icon next to an app.](Images/Exercise1-02.png)

1. Select the **Uninstall** button to complete to uninstall the app.

1. Select the **Upload a custom app** link at the bottom right corner of the application.

1. Select the zip file from the **bin** folder that represents your app. Select **Open**.

1. The app is displayed. The description and icon for the app is displayed.

    ![Screenshot of Microsoft Teams with new app displayed.](Images/Starter-09.png)

### Add tab to team view

Configurable tabs are displayed in a channel.

1. Tabs are not automatically displayed for the team. To add the tab, select **General** channel in the team.

1. Select the **+** icon at the end of the tab strip.

1. In the tab gallery, uploaded tabs are displayed in the **Tabs for your team** section. Tabs in this section are arranged alphabetically. Select the tab created in this lab.

    ![Screenshot of tab gallery with the talent management app highlighted.](Images/Exercise1-04.png)

1. Type a name for the tab and select a position. Select **Save**.

1. The tab is displayed in the channel tab strip.

    ![Screenshot of Microsoft Teams showing the configurable tab added in the lab](Images/Exercise1-05.png)

Static tabs are displayed in the chat view with the bot.

1. Select the **Chat** icon in the left-side panel of Microsoft Teams.

1. Select the conversation with the Talent Management Bot.

1. The new tab is shown in the Tab Strip above the conversation. Select the tab to display the html page.

    ![Screenshot of Microsoft Teams showing the static tab added in the lab.](Images/Exercise1-03.png)

## Exercise 2: Connectors

Connectors for Microsoft Teams must be registered on the [Connectors Developer Dashboard](https://aka.ms/connectorsdashboard).

1. In a browser, navigate to https://aka.ms/connectorsdashboard.

1. Select New Connector

1. Provide a name, logo, descriptions and website for the connector.

1. The **Configuration page for your Connector** is not used for Microsoft Teams, however a url must be provided.

1. The **Valid domains** is used for actionable messages. Provide the forwarding address from the ngrok tunnel application.

1. Accept the terms and conditions and select **Save**. The page will refresh with additional information.

    ![Screenshot of the Connector Developer Dashboard showing a registered connector.](Images/Exercise2-02.png)

1. The connector Id is required for the Teams manifest. The Id is included in the query string of the completed page on the Connector Developer Dashboard. Alternatively, download the manifest and copy from the generated file. (You will add the connector to the existing Teams app, so the downloaded manifest is not necessary.)

Update the Visual Studio solution.

1. In Visual Studio right-click on the project, choose **Add > New Folder**. Name the folder Connector.

1. Add the displayed files from the **Lab Files** folder of this repository.

    ![Screenshot of Solution Explorer with manifest folder displayed.](Images/Exercise2-01.png)

1. Open the **connectorconfig.html** file in the **Tabs** folder.

1. Add the following tag within the `<head>` tag in the file. This script will initialize the Teams JavaScript API and then use the API to register the webhook. In addition to setting the webhook URL, the script will set the contentUrl property. For connectors, the contentUrl specifies the page to show when a user invokes the configure action on a connector.

    ```js
    <script type="text/javascript">
      var host = `https://${window.location.hostname}`;

      $(document).ready(function () {
        // Initialize the Microsoft Teams Library
        microsoftTeams.initialize();

        microsoftTeams.settings.getSettings(function (settings) {
          webhookUrl = settings.webhookUrl;
          $('#webhookurl').text(webhookUrl);
        });

        // Set the 'Save' Button state
        microsoftTeams.settings.setValidityState(true);

        // Save handler when user clicked on Save button
        microsoftTeams.settings.registerOnSaveHandler(function (saveEvent) {
          microsoftTeams.getContext(function (context) {

            url = `${host}/Connector/connectorConfig.html`;

            entity = `connector-officedev-${context.teamId}-${context.channelId}`;

            microsoftTeams.settings.setSettings({
              entityId: entity,
              contentUrl: url,
              configName: 'OfficeDev Talent Management'
            });

            saveEvent.notifySuccess();

          });
        });
      });
    </script>
    ```

1. Open the **manifest.json** file in the **Manifest** folder.

1. Locate the `configurableTabs` node of the **manifest.json** file. Add the following node as a sibling (at the same level) as the `configurableTabs` node. Replace the token `[from-ngrok]` with the unique identifier from the forwarding address from the ngrok tunnel application.

    ```json
    "connectors": [
      {
        "connectorId": "c63a8789-739b-4afd-91db-0e1bd7f213b9",
        "scopes": [
          "team"
        ],
        "configurationUrl": "https://[from-ngrok].ngrok.io/Connector/connectorConfig.html"
      }
    ],
    ```

1. Locate the `validDomains` node in the **manifest.json**. Ensure that the host from the ngrok forwarding address is included in the `validDomains` node. (Do not enter the URI scheme, only the host. For example: `ab29ba51.ngrok.io`).

1. Press **F5** to compile, create the package and start the debugger. Since the manifest file has changed, the app must be re-uploaded to Microsoft Teams.

## Connect to a channel

1. To add the connector, select the elipsis to the right of **General** channel in the team. Then select **Connectors**.

    ![Screenshot of Teams showing steps to add a connector](Images/Exercise2-03.png)

1. Connectors from uploaded Microsoft Teams app displayed at the bottom of this list. Scroll to the bottom and choose
**OfficeDev Talent Management**.

    ![Screenshot of Connector list highlighting the uploaded app](Images/Exercise2-04.png)

1. The Connector configuration page is displayed. Select **Save** to register the connector.

    ![Screenshot of connector configuration page](Images/Exercise2-05.png)
1. From the Connector list, select **OfficeDev Talent Management**. Select **Configure**. THe configuration page will display the webhook URL for posting to the channel.