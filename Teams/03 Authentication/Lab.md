# Lab - Authentication

In this lab, you will walk through extending a Microsoft Teams app with the capability of calling secured resources via OAuth2.0 and Azure Active Directory.

## In this lab

- [Add authentication to a tab](#exercise1)
- [Add authentication to a bot](#exercise2)

## Application Registration worksheet

This lab requires the registration of multiple applications in Azure Active Directory (Azure AD), the Bot Framework and the Azure Portal. The **LabFiles** folder of this module contains a file named **AppWorksheet.txt** which can be used to record the various ids and secrets generated in the lab.

## Prerequisites

Developing apps for Microsoft Teams requires preparation for both the Office 365 tenant and the development workstation.

For the Office 365 Tenant, the setup steps are detailed on the [Get started developing apps for Microsoft Teams](https://docs.microsoft.com/en-us/microsoftteams/platform/get-started/get-started).  Note that while the getting started page indicates that the Public Developer Preview is optional, this lab includes steps that are not possible unless the preview is enabled. Information about the Developer Preview program and participation instructions are detailed on the [What is the Developer Preview for Microsoft Teams? page](https://docs.microsoft.com/en-us/microsoftteams/platform/resources/dev-preview/developer-preview-intro).

### Administrator credentials to tenant

This lab requires delegated permissions that are consented by a tenant administrator. If you are not an administrator in your tenant, you can request a developer tenant through the [Office 365 developer program](https://developer.microsoft.com/en-us/office/dev-program)

### Azure Subscription

The Azure Bot service requires an Azure subscription. A free trial subscription is sufficient.

### Install developer tools

The developer workstation requires the following tools for this lab.

#### Download ngrok

As Microsoft Teams is an entirely cloud-based product, it requires all services it accesses to be available from the cloud using HTTPS endpoints. To enable the exercises to work within Microsoft Teams, a tunneling application is required.

This lab uses [ngrok](https://ngrok.com) for tunneling publicly-available HTTPS endpoints to a web server running locally on the developer workstation. ngrok is a single-file download that is run from a console.

#### Code editors

Tabs in Microsoft Teams are HTML pages hosted in an iframe. The pages can reference CSS and JavaScript like any web page in a browser. Connectors are implemented via a web service, running server-side code.

You can use any code editor or IDE that supports these technologies, however the steps and code samples in this training use [Visual Studio 2017](https://www.visualstudio.com/).

### Starter solution

The exercises in this lab will extend the Microsoft Teams app built in the module [02 - Tabs and Connectors](../02%20Tabs%20and%20Connectors). A working copy of that application is in the **LabFiles\Starter** folder.

## Update Starter solution

1. Launch **Visual Studio 2017** as an administrator: right-click **Visual Studio 2017** and select **Run as administrator**.

1. In **Visual Studio 2017**, select **File > Open > Project/Solution**.

1. Select the **officedev-talent-management.sln** file from the **LabFiles\Starter** folder.

### Find the project URL

1. In **Solution Explorer**, double-click on **Properties**.

1. In the **Properties** designer, select the **Web** tab.

1. Note the **Project URL**.

    ![Screenshot of Solution Explorer highlighting project URL.](./Images/Starter-01.png)

### Run the ngrok secure tunnel application

1. Open a new **Command Prompt** window.

1. Change to the directory that contains the **ngrok.exe** application.

1. Run the command `ngrok http [port] -host-header=localhost:[port]`. Replace `[port]` with the port portion of the URL noted above.

1. The ngrok application will fill the entire prompt window.

    > **NOTE:** Record the **Forwarding address** using https on the AppWorksheet as the "ngrok forwarding address".

1. Minimize the ngrok command prompt window. It is no longer referenced in this lab, but it must remain running.

    ![Screenshot of ngrok command prompt with local host highlighted.](./Images/Starter-02.png)

### Register the bot

1. Register a bot on the Microsoft Bot Framework portal. You must use this link to create a new bot: https://dev.botframework.com/bots/new. Log in with Work or School account that is an administrator for the Azure AD tenant. (If you select the **Create a bot button** in the Bot Framework portal instead, you will create your bot in Microsoft Azure instead.)

1. Complete the **Bot profile** section, entering a display name, unique bot handle and description. (It is recommended to include **bot** in the name to help distinguish this entry later in the lab.)

    > **NOTE:** Record the **Bot handle** on the AppWorksheet as the "BotID".

    ![Screenshot of bot profile information page.](./Images/Starter-03.png)

1. Complete the configuration section.
    - For the Messaging endpoint, use the value recorded on the AppWorksheet as **ngrok forwarding address** prepended to the route to the `MessagesController` in the Visual Studio project.
    - Select the **Create Microsoft App ID and password button**. This opens a new browser window. If prompted to login, use the same account as the Bot Framework Portal.
    - In the new browser window, the application is registered in Azure Active Directory. Select **Generate an app password to continue**.
    - An app password is generated.
      > **NOTE:** Record the password on the AppWorksheet as the "MicrosoftAppPassword".
    - Select **OK** to close the dialog box.
    - Select the **Finish and go back to Bot Framework** button to close the new browser window
    - The app ID from Azure Active Directory will be set in the Configuration section. (The page instructions are **Paste your app ID below to continue textbox**, but the value is already filled in.)
      > **NOTE:** Record the app ID on the AppWorksheet as the "MicrosoftAppID".

    ![Screenshot of configuration page with messaging endpoint and app ID displayed.](./Images/Starter-04.png)

1. Move to the bottom of the page. Agree to the privacy statement, terms of use and code of conduct and select the **Register** button. Once the bot is created, select **OK** to dismiss the dialog box. The **Connect to channels** page is displayed for the newly-created bot.

> **Note:** The Bot migration message (shown in red) can be ignored for Microsoft Teams bots. Additional information can be found in the Microsoft Teams developer documentation, on the [Create a bot page](https://docs.microsoft.com/en-us/microsoftteams/platform/concepts/bots/bots-create#bots-and-microsoft-azure).

1. The bot must be connected to Microsoft Teams. Select the **Microsoft Teams** logo.

    ![Screenshot of Microsoft Bot Framework with Microsoft Teams logo highlighted.](./Images/Starter-05.png)

1. Select the **Save** button. Agree to the Terms of Service. The bot registration is complete.

    ![Screenshot of Microsoft Bot Framework with configuration message displayed.](./Images/Starter-06.png)

    >**Note:** Selecting **Settings** in the top navigation will re-display the profile and configuration sections. This can be used to update the messaging endpoint in the event ngrok is stopped, or the bot is moved to staging & production.

### Configure the web project

The bot project must be configured with information from the registration.

1. In **Visual Studio**, open the **Web.config** file. Locate the `<appSettings>` section.

1. Replace the token `[BotId]` with the value recorded on the AppWorksheet as **BotId**.

1. Replace the token `[MicrosoftAppId]` with the value recorded on the AppWorksheet as **MicrosoftAppID**.

1. Replace the token `[MicrosoftAppPassword]` with the value recorded on the AppWorksheet as **MicrosoftAppPassword**.

1. Save and close the **web.config** file.

1. In the **Manifest** folder , open the **manifest.json** file. The **manifest.json** file requires several updates:
    - The `id` property must contain the app ID from registration. Replace the token `[MicrosoftAppID]` with the value recorded on the AppWorksheet as **MicrosoftAppID**.
    - The `packageName` property must contain a unique identifier. The industry standard is to use the bot's URL in reverse format. Replace the token `[from-ngrok]` with the value record on the AppWorksheet as **ngrok forwarding address id**.
    - The `developer` property has three URLs that should match the hostname of the Messaging endpoint. Replace the token `[from-ngrok]` with the value record on the AppWorksheet as **ngrok forwarding address id**.
    - The `botId` property in the `bots` collection property also requires the app ID from registration. Replace the token `[MicrosoftAppID]` with the value recorded on the AppWorksheet as **MicrosoftAppID**.
    - The `configurableTabs` property also contains a URL. This value will be updated later in the lab, so no update is required at this time.
    - The `validDomains` property requires a string array of all domains that will be accessed by the Teams app. Replace the token `[from-ngrok]` with the value record on the AppWorksheet as **ngrok forwarding address id**.
    - Save and close the **manifest.json** file.

1. Press **F5** to build the solution and package and start the web service in the debugger. The debugger will start the default browser, which can be ignored. The next step uses the teams client.

### Upload app into Microsoft Teams

Although not strictly necessary, in this lab the bot will be added to a new team. Use the same team throughout this lab.

1. In the Microsoft Teams application, click the **Add team** link. Then click the **Create team** button.

    ![Screenshot of Microsoft Teams with Create Team button highlighted.](Images/Starter-07.png)

1. Enter a team name and description. Select **Next**.

1. Optionally, invite others from your organization to the team. This step can be skipped in this lab.

1. The new team is shown. In the left-side panel, select the ellipses next to the team name. Choose **Manage team** from the context menu.

    ![Screenshot of Microsoft Teams with Manage Team highlighted.](Images/Starter-08.png)

1. On the Manage team display, select **Apps** in the tab strip. Then select the **Upload a custom app** link at the bottom right corner of the application.

1. Select the zip file from the **bin** folder that represents your app. Select **Open**.

1. The app is loaded to the Team. The description and icon for the app is displayed.

    ![Screenshot of Microsoft Teams with new app displayed.](Images/Starter-09.png)

The app is now installed. The following exercises will extend this app.

<a name="exercise1"></a>

## Exercise 1: Add authentication to a tab

In this exercise, an additional tab is added to the app to show the hiring team (which is the membership of the current group). Although the Microsoft Teams API can provide the group members, that information is intended to facilitate communication with those members. To get the authoritative information about a user, the Microsoft Graph must be called.

When the bot was registered, an application registration was created in the AAD tenant. While it is possible to update this registration, the recommended practice is to create a separate application registration to represent your code. This new application must have permission to read the group members and read information about all users.

### Register application in the Azure Active Directory

1. Open the [Azure Active Directory admin center](https://aad.portal.azure.com).

1. Log in with the work or school account that is an administrator in the tenant.

1. Select **Azure Active Directory** in the left-most blade.

1. In the **Overview** blade, select **Properties** (near the bottom).

1. In the **Directory Properties** blade, copy the **Directory ID**.

    > **NOTE:** Record the **Directory ID** on the AppWorksheet as the "AzureTenantID".

1. Close the **Directory Properties** blade, returning to the **Overview** blade.

1. Select **App registrations**.

1. Select **New application registration**.

1. Enter a name for the application. A suggested name is `Talent Management application` which distinguishes this application from the bot.

1. Select `Web app / API` for the **Application type**

1. Enter the following address for the **Sign-in URL**. Replace the token `[from-ngrok]` with the value record on the AppWorksheet as **ngrok forwarding address id**. (The Sign-in URL is case-sensitive.)

    ```
    https://[from-ngrok]/Tabs/auth.html
    ```

1. Select **Create**.

1. On the application blade, copy the **Application Id**.

    > **NOTE:** Record the **Application Id** on the AppWorksheet as the "AzureAppID".

1. Select **Manifest**.

    ![Screenshot if the Azure AD Portal showing the application blade](Images/Exercise1-01.png)

1. Location the **oauth2AllowImplicitFlow** property. Set the property to `true`. (Note that the property is a boolean, not a string.)

1. Select **Save** and then close the **Edit manifest blade**.

1. In the application blade, select **Settings**.

1. In the **Settings** blade, select **Required permissions**.

1. In the **Required permissions** blade, select **Select and API**.

1. In the **Select an API blade** blade, select **Microsoft Graph**. Select the **Select** button at the bottom of the blade.

1. In the resulting **Enable access** blade, select the following Delegated permissions:
    - **Read all users' full profiles**
    - **Read all groups**
    - **Sign users in**
    - **View users' basic profile**

1. Select the **Select** button at the bottom of the blade. Select **Done**.

1. In the **Required permissions** blade, select **Grant permissions**. Select **Yes**.

### Replace the tab in the Teams app

1. In **Visual Studio**, open the `manifest.json` file in the **Manifest** folder.

1. Locate the `configurableTabs` node of the document. Replace the existing tab definition with the following entry. Replace the token `[from-ngrok]` with the value record on the AppWorksheet as **ngrok forwarding address id**.

    ```json
    {
      "configurationUrl": "https://[from ngrok].ngrok.io/Tabs/hiringTeamConfig.html",
      "canUpdateConfiguration": true,
      "scopes": [ "team" ]
    }
    ```

### Add the tab pages to the solution

1. Add the following pages from the **LabFiles** folder to the project, in the **Tabs** folder:

- hiringTeam.html
- hiringTeamConfig.html
- auth.html

1. Open file **auth.html** in the **Tabs** folder. The **auth.html** contains javascript code that will use the MSAL library to acquire an access token for the Microsoft Graph API.

- Replace the token `[AzureAppID]` with the value recorded on the AppWorksheet as **AzureAppID**.
- Replace the token `[AzureTenantID]` with the value recorded on the AppWorksheet as **AzureTenantID**.

1. Open file **hiringTeam.html** in the **Tabs** folder. The **hiringTeam.html** page contains javascript code that will use the Microsoft Teams API to open the authentication window, calling auth.html. The resulting access token is used to call the Microsoft Graph API.

- Replace the token `[AzureAppID]` with the value recorded on the AppWorksheet as **AzureAppID**.
- Replace the token `[AzureTenantID]` with the value recorded on the AppWorksheet as **AzureTenantID**.

1. Press **F5** to compile, create the package and start the debugger. Since the manifest file has changed, the app must be re-uploaded to Microsoft Teams.

### Remove and upload app

1. In the left-side panel of Microsoft Teams, select the ellipses next to the team name. Choose **Manage team** from the context menu.

    ![Screenshot of Microsoft Teams with Manage Team highlighted.](Images/Starter-08.png)

1. On the Manage team display, select **Apps** in the tab strip. Locate app in the list and select the trash can icon on the right.

    ![Screenshot of Microsoft Teams highlighting the trash can icon next to an app.](Images/Exercise1-03.png)

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

1. Type a name for the tab. Select **Save**.

    ![Screenshot of the tab configuration page](Images/Exercise1-07.png)

1. The tab is displayed in the channel tab strip.

1. When the tab is first viewed by a user, the Talent Management application does not have a token to use for calls to the Microsoft Graph. Microsoft Teams will display a popup window which may request login credentials. If a valid token is cached for the user, the popup window will close without user intervention.

    ![Screenshot of Microsoft Teams showing the login popup window.](Images/Exercise1-08.png)

1. The tab will display the members of the Azure Active Directory group that supports the Team. Changes to the Team members will be reflected the next time the tab is displayed.

    ![Screenshot of Microsoft Teams showing the configurable tab added in the lab](Images/Exercise1-05.png)

1. If the popup window is closed or the login is not successful, the tab will display a login button. Select the **Login to Azure AD** button to re-initiate the login/token acquisition flow.

    ![Screenshot of Microsoft Teams showing the application tab with the Login to Azure AD button](Images/Exercise1-06.png)

<a name="exercise2"></a>

## Exercise 2: Add authentication to a bot

In this exercise, an additional command is added to the bot to display the profile of the current user. This information is retrieved from the Microsoft Graph API.

When the bot was registered, an application registration was created in the AAD tenant. While it is possible to update this registration, the recommended practice is to create a separate application registration to represent your code. This new application must have permission to read the current user profile information. The application registered in Exercise 1 has this permission granted already. In this exercise, that application is reference using AzureAppId and AzureTenantID.

### Update the Application Registration

The bot framework can facilitate the token acquisition for a bot. This requires the bot to be registered with the Azure Bot service and an OAuth connection to the Azure application configured.

1. Open the [Azure Portal](https://portal.azure.com).

1. In the Azure Portal, select **Azure Active Directory**.

1. Select **App Registrations**. Select **View All registrations**.

1. Select the application created in Exercise 1. The suggested name was **Talent Management application**.

1. Copy the **Application Id**.

    > NOTE: You will use this Application Id in the bot code. This value is referred to as the "AzureAppID".

1. Select **Settings**. In the **General** section, select **Reply URLs**.

1. Add the following as a reply url: `https://token.botframework.com/.auth/web/redirect`. (The existing reply url for the tab can remain.) Select **Save**.

1. In the **API Access** section, select **Keys**.

1. On the **Keys** blade, under **Passwords**, create a key with the description `BotLogin`. Set its Duration to **Never expires**.

1. Select **Save**. Record the key value.

    > NOTE: You will use this secret in the bot code. This value is referred to as the "AzureAppSecret".

### Create a Bot Service Channel registration

1. Close all open blades in the Azure Portal.

1. Select **Create a resource**.

1. In the **Search the marketplace** box, enter `bot`.

1. Choose **Bot Channels Registration**

1. Select the **Create** button.

1. Complete the **Bot Channels Registration** blade. For the **Bot name**, enter a descriptive name to distinguish this registration from the bot registered on the Bot Framework portal and from the application registered to access the Microsoft Graph API. A suggested name is `OfficeTalentBotAzureService`.

1. For the messaging endpoint, use the ngrok tunnel endpoint prepended to `/api/messages`.

1. Allow the service to auto-create an application.

1. Select **Create**.

1. When the deployment completes, navigate to the resource in the Azure portal. In the left-most navigation, select **All resources**. In the **All resources** blade, select the Bot Channels Registration. (The suggested name was **OfficeTalenBotAzureServie**.)

1. In the **Bot Management** section, select **Channels**.

1. Click on the Microsoft Teams logo to create a connection to Teams. Select **Save**. Agree to the Terms of Service.

1. In the **Bot Management** section, select *Settings**.

1. Select **Add Setting** in the **OAuth Connection Settings** section.

1. Fill in the form as follows:
    - For Name, enter `TalentManagementApplication`.
      > NOTE: You will use this name in your bot code. This value is referred to as the "OAuthConnectionName".
    - For Service Provider, select `Azure Active Directory`. Once you select this, the Azure AD-specific fields will be displayed.
    - For **Client id**, enter the **AzureAppID** recorded in exercise 1.
    - For **Client secret**, enter the **AzureAppSecret** recorded earlier when updating the Azure application. The secret has the description **BotLogin**.
    - For **Grant Type**, enter `authorization_code`.
    - For **Login URL**, enter `https://login.microsoftonline.com`.
    - For **Tenant ID**, enter the **AzureTenantID** recorded in exercise 1.
    - For **Resource URL**, enter `https://graph.microsoft.com/`.
    - Leave Scopes blank.

1. Select Save.

#### Record the Bot Channel Registration Bot Id and secret

The Visual Studio solution will use the Bot Channel Registration, replacing the Bot Framework registration.

1. In the **Bot Channels Registration** blade, select **Settings** under **Bot Management**

1. The **Microsoft App Id** is displayed. Record this value.

    > NOTE: You will use this app Id in the Visual Studio application configuration. This value is referred to as the "BotChannelRegistrationId".

1. Next to the **Microsoft App Id**, select the **Manage** link. This will open the Application Registration Portal in a new tab. If prompted, log in with the same credentials used for the Azure Portal.

1. In the **Application Secrets** section, select **Generate New Password**. A new password is created and displayed in a popup dialog. Record the new password.

    > NOTE: You will use this password in the Visual Studio application configuration. This value is referred to as the "BotChannelRegistrationPassword".

1. You may close the browser tab containing the Application Registration Portal. It is no longer needed.

### Update Visual Studio solution configuration

1. In **Visual Studio**, right-click on the project in **Solution Explorer**.

1. Select **Add > Reference**.

1. Add a reference to **System.Configuration**. Select **OK**.

1. Open the **web.config** file.

1. Add a new key to the `appSettings` section. (Ensure the value matches the OAuthConnectionName recorded earlier from the Bot Channel Registration.)

    ```xml
    <add key="OAuthConnectionName" value="TalentManagementApplication"/>
    ```

1. Change the value for the key `MicrosoftAppId` to the value named BotChannelRegistrationId recorded earlier.

1. Change the value for the key `MicrosoftAppPassword` to the value named BotChannelRegistrationPassword recorded earlier.

1. Save and close the **web.config** file.

1. Open the **manifest.json** file in the **Manifest** folder.

1. Locate the `id` property.  Replace the `botId` value with the BotChannelRegistrationId recorded earlier.

1. Locate the `name` node. Change short and long names to differentiate the BotChannelRegistration bot from the BotFramework bot.

1. Locate the `bots` node. Replace the `botId` value with the BotChannelRegistrationId recorded earlier.

1. Locate the `validDomains` node. Add the domain `token.botframework.com`. (The node value is a string array.)

1. Save and close **manifest.json**.

### Update Bot to process new command

1. Open the **MessagesController.cs** file in the **Controllers** folder.

1. In the `Post` method, the `Type` property of the incoming Activity is inspected. In the branch of the code where the Activity.Type property is `ActivityTypes.Invoke`, add the following code:

    ```csharp
    else if (activity.IsTeamsVerificationInvoke())
    {
      await Conversation.SendAsync(activity, () => new Dialogs.RootDialog());
    }
    ```

1. Open the **RootDialog.cs** file in the **Dialogs** folder.

1. In the `MessageReceivedAsync` method, after the region named **Commands**, the message text is inspected for single-word commands. Add the following test to the method:

    ```csharp
    else if (text.Contains("profile"))
    {
      await CommandHandlers.HandleProfileCommand(context);
      return;
    }
    ```

1. Open the **CommandHelpers.cs** file in the root folder of the project.

1. Add the following methods to the **CommandHandlers** class.

    ```cs
    #region HandleProfileCommand

    private static string ConnectionName = System.Configuration.ConfigurationManager.AppSettings["OAuthConnectionName"];

    public static async Task HandleProfileCommand(IDialogContext context)
    {
      // Display information about the logged in user
      context.Call(CreateGetTokenDialog(), ListMe);
    }

    private static GetTokenDialog CreateGetTokenDialog()
    {
      return new GetTokenDialog(
          ConnectionName,
          $"Please sign in to {ConnectionName} to proceed.",
          "Sign In",
          2,
          "Hmm. Something went wrong, let's try again.");
    }

    private static async Task ListMe(IDialogContext context, IAwaitable<GetTokenResponse> tokenResponse)
    {
      try
      {
        var token = await tokenResponse;

        var httpRequest = new System.Net.Http.HttpRequestMessage(System.Net.Http.HttpMethod.Get, "https://graph.microsoft.com/v1.0/me");
        httpRequest.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token.Token);

        var httpClient = new System.Net.Http.HttpClient();
        System.Net.Http.HttpResponseMessage response = await httpClient.SendAsync(httpRequest);
        var responseContent = await response.Content.ReadAsStringAsync();
        JObject me = JObject.Parse(responseContent);

        await context.PostAsync($"You are {me["displayName"]} and your title is {me["jobTitle"]}.");
      }
      catch (Exception ex)
      {
        await context.PostAsync($"Error: {ex.Message}");
      }

    }

    #endregion
    ```

    1. Press **F5** to compile, create the package and start the debugger. Since the manifest file has changed, the app must be re-uploaded to Microsoft Teams.

### Remove and re-upload app

1. In the left-side panel of Microsoft Teams, select the ellipses next to the team name. Choose **Manage team** from the context menu.

    ![Screenshot of Microsoft Teams with Manage Team highlighted.](Images/Starter-08.png)

1. On the Manage team display, select **Apps** in the tab strip. Locate app in the list and select the trash can icon on the right.

    ![Screenshot of Microsoft Teams highlighting the trash can icon next to an app.](Images/Exercise1-03.png)

1. Select the **Uninstall** button to complete to uninstall the app.

1. Select the **Upload a custom app** link at the bottom right corner of the application.

1. Select the zip file from the **bin** folder that represents your app. Select **Open**.

1. The app is displayed. The description and icon for the app is displayed.

    ![Screenshot of Microsoft Teams with new app displayed.](Images/Starter-09.png)

### Use the new Profile command

1. In a channel conversation, "at" mention the bot and issue the command `profile`.

1. The bot will attempt to acquire a token for the current user from the Azure Bot Service. If the token is stale, missing, does not have the requested scopes or is otherwise not valid, the bot will reply with a sign-in card.

    ![Screenshot of bot with signin card](Images/Exercise2-01.png)

1. On the sign-in card, select **Sign in**. Microsoft Teams will display a popup dialog with the Azure AD login. Complete the login.

1. Once sign-in ins complete, the bot will access profile information for the current user and write a message.

    ![Screenshot of bot with profile information message](Images/Exercise2-02.png)

