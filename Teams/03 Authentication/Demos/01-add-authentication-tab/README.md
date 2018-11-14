# Add Authentication to a Tab

In this demo, you will demonstrate the construction of a configurable tab that acquires an access token from Azure Active Directory and calls the Microsoft Graph API.

## Application Registration worksheet

This demo requires the registration of multiple applications in Azure Active Directory (Azure AD), the Bot Framework and the Azure Portal. The **LabFiles** folder of this module contains a file named **AppWorksheet.txt** which can be used to record the various ids and secrets generated and used in the demo.

## Prerequisites

Developing apps for Microsoft Teams requires preparation for both the Office 365 tenant and the development workstation.

For the Office 365 Tenant, the setup steps are detailed on the [Prepare your Office 365 Tenant page](https://docs.microsoft.com/en-us/microsoftteams/platform/get-started/get-started-tenant). Note that while the getting started page indicates that the Public Developer Preview is optional, this lab includes steps that are not possible unless the preview is enabled. Information about the Developer Preview program and participation instructions are detailed on the [What is the Developer Preview for Microsoft Teams? page](https://docs.microsoft.com/en-us/microsoftteams/platform/resources/dev-preview/developer-preview-intro).

### Administrator credentials to tenant

This demo requires delegated permissions that are consented by a tenant administrator. If you are not an administrator in your tenant, you can request a developer tenant through the [Office 365 developer program](https://developer.microsoft.com/en-us/office/dev-program)

### Download ngrok

As Microsoft Teams is an entirely cloud-based product, it requires all services it accesses to be available from the cloud using HTTPS endpoints. To enable the exercises to work within Microsoft Teams, a tunneling application is required.

This lab uses [ngrok](https://ngrok.com) for tunneling publicly-available HTTPS endpoints to a web server running locally on the developer workstation. ngrok is a single-file download that is run from a console.

## Update Demo solution

Make the following updates to the demo solution.

1. Launch **Visual Studio 2017** as an administrator: right-click **Visual Studio 2017** and select **Run as administrator**.

1. In **Visual Studio 2017**, select **File > Open > Project/Solution**.

1. Select the **officedev-talent-management.sln** file from the **Demos\01-add-authentication-tab\solution** folder.

### Find the project URL

1. In **Solution Explorer**, double-click on **Properties**.

1. In the **Properties** designer, select the **Web** tab.

1. Note the **Project URL**.

    ![Screenshot of Solution Explorer highlighting project URL.](../../Images/Demo-01.png)

### Run the ngrok secure tunnel application

1. Open a new **Command Prompt** window.

1. Change to the directory that contains the **ngrok.exe** application.

1. Run the command `ngrok http [port] -host-header=localhost:[port]`. Replace `[port]` with the port portion of the URL noted above.

1. The ngrok application will fill the entire prompt window.

    > **NOTE:** Record the **Forwarding address** using https on the AppWorksheet as the "ngrok forwarding address".

1. Minimize the ngrok command prompt window. It is no longer referenced in this lab, but it must remain running.

    ![Screenshot of ngrok command prompt with local host highlighted.](../../Images/Demo-02.png)

## Register application in the Azure Active Directory

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

1. Select `Web app / API` for the **Application type**.

1. Enter the following address for the **Sign-in URL**. Replace the token `[from-ngrok]` with the value recorded on the AppWorksheet as **ngrok forwarding address id**. (The Sign-in URL is case-sensitive.)

    ```
    https://[from-ngrok]/Tabs/auth.html
    ```

1. Select **Create**.

1. On the **Application blade**, copy the **Application Id**.

    > **NOTE:** Record the **Application Id** on the AppWorksheet as the "AzureAppID".

1. Select **Manifest**.

    ![Screenshot if the Azure AD Portal showing the application blade](../../Images/Exercise1-01.png)

1. Location the **oauth2AllowImplicitFlow** property. Set the property to `true`. (Note that the property is a boolean, not a string.)

1. Select **Save** and then close the **Edit manifest blade**.

1. Select **Settings**. In the **General** section, select **Reply URLs**.

1. Add the following as a reply url: `https://token.botframework.com/.auth/web/redirect`. (The existing reply url for the tab can remain.) Select **Save**.

1. On the **Application blade**, select **Settings**.

1. On the **Settings** blade, select **Required permissions**.

1. On the **Required permissions** blade, select **Add**.

1. On the **Add API access** blade, select **Select an API**.

1. On the **Select an API blade** blade, select **Microsoft Graph**. Select the **Select** button at the bottom of the blade.

1. On the resulting **Enable access** blade, select the following Delegated permissions:
    - **Read all users' full profiles**
    - **Read all groups**
    - **Sign users in**
    - **View users' basic profile**

1. Select the **Select** button at the bottom of the blade. Select **Done**.

1. In the **Required permissions** blade, select **Grant permissions**. Select **Yes**.

## Update the Visual Studio project

The Visual Studio project must be updated with information from the registration.

1. In **Visual Studio**, open file **auth.html** in the **Tabs** folder.
    - Replace the token `[AzureAppID]` with the value recorded on the AppWorksheet as **AzureAppID**.
    - Replace the token `[AzureTenantID]` with the value recorded on the AppWorksheet as **AzureTenantID**.

1. Open file **hiringTeam.html** in the **Tabs** folder.
    - Replace the token `[AzureAppID]` with the value recorded on the AppWorksheet as **AzureAppID**.
    - Replace the token `[AzureTenantID]` with the value recorded on the AppWorksheet as **AzureTenantID**.

1. In the **Manifest** folder , open the **manifest.json** file. The **manifest.json** file requires several updates:
    - The `packageName` property must contain a unique identifier. The industry standard is to use the bot's URL in reverse format. Replace the token `[from-ngrok]` with the value record on the AppWorksheet as **ngrok forwarding address id**.
    - The `developer` property has three URLs that should match the hostname of the Messaging endpoint. Replace the token `[from-ngrok]` with the value record on the AppWorksheet as **ngrok forwarding address id**.
    - The `configurableTabs` property also contains a URL. Replace the token `[from-ngrok]` with the value record on the AppWorksheet as **ngrok forwarding address id**.
    - The `validDomains` property requires a string array of all domains that will be accessed by the Teams app. Replace the token `[from-ngrok]` with the value record on the AppWorksheet as **ngrok forwarding address id**.
    - Save and close the **manifest.json** file.

1. Press **F5** to compile, create the package and start the debugger.

### Upload app into Microsoft Teams

Although not strictly necessary, in this demo the app is added to a new team.

1. In the Microsoft Teams application, click the **Add team** link. Then click the **Create team** button.

    ![Screenshot of Microsoft Teams with Create Team button highlighted.](../../Images/Demo-07.png)

1. Enter a team name and description. Select **Next**.

1. Invite others from the organization to the team. The demo provides more impact with members in addition to the owner.

1. The new team is shown. In the left-side panel, select the ellipses next to the team name. Choose **Manage team** from the context menu.

    ![Screenshot of Microsoft Teams with Manage Team highlighted.](../../Images/Starter-08.png)

1. On the Manage team display, select **Apps** in the tab strip. Then select the **Upload a custom app** link at the bottom right corner of the application.

1. Select the zip file from the **bin** folder that represents your app. Select **Open**.

1. The app is displayed. The description and icon for the app is displayed.

    ![Screenshot of Microsoft Teams with new app displayed.](../../Images/Starter-09.png)

    The app is now uploaded into the Microsoft Teams application and the bot is available.

## Add tab to team view

Configurable tabs are displayed in a channel.

1. Tabs are not automatically displayed for the team. To add the tab, select **General** channel in the team.

1. Select the **+** icon at the end of the tab strip.

1. In the tab gallery, uploaded tabs are displayed in the **Tabs for your team** section. Tabs in this section are arranged alphabetically. Select the tab created in this lab.

    ![Screenshot of tab gallery with the talent management app highlighted.](../../Images/Exercise1-04.png)

1. Type a name for the tab and select a position. Select **Save**.

1. The tab is displayed in the channel tab strip.

    ![Screenshot of Microsoft Teams showing the configurable tab added in the lab](../../Images/Exercise1-05.png)

1. When the tab is first viewed by a user, the Talent Management application does not have a token to use for calls to the Microsoft Graph. Microsoft Teams will display a popup window which may request login credentials. If a valid token is cached for the user, the popup window will close without user intervention.

    ![Screenshot of Microsoft Teams showing the login popup window.](../../Images/Exercise1-08.png)

1. The tab will display the members of the Azure Active Directory group that supports the Team. Changes to the Team members will be reflected the next time the tab is displayed.

    ![Screenshot of Microsoft Teams showing the configurable tab added in the lab](../../Images/Exercise1-05.png)

1. If the popup window is closed or the login is not successful, the tab will display a login button. Select the **Login to Azure AD** button to re-initiate the login/token acquisition flow.

    ![Screenshot of Microsoft Teams showing the application tab with the Login to Azure AD button](../../Images/Exercise1-06.png)