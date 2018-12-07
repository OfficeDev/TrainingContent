# Call the Microsoft Graph API inside a tab

In this demo, you will demonstrate calling the Microsoft Graph from TypeScript code in a Microsoft Teams tab.

### Run the ngrok secure tunnel application

1. Open a new **Command Prompt** window.

1. Change to the directory that contains the **ngrok.exe** application.

1. Run the command `ngrok http 3007`.

1. The **ngrok** application will fill the entire prompt window. Make note of the forwarding address using HTTPS. This address is required in the next step.

1. Minimize the ngrok command prompt window. It is no longer referenced in this exercise, but it must remain running.

    ![Screenshot of ngrok with local host highlighted.](../../Images/Exercise1-04.png)

### Register an application in AAD

To enable an application to call the Microsoft Graph API, an application registration is required. This lab uses the [Azure Active Directory v2.0 endpoint](https://docs.microsoft.com/en-us/azure/active-directory/develop/active-directory-v2-compare).

1. Open the [Application Registration Portal](https://apps.dev.microsoft.com).

1. Log in with a work or school account.

1. Select **Add an app**.

1. Complete the **Register your application** section by entering an application name and contact email. Clear the checkbox for **Guided Setup**. Select **Create**.

    ![Screenshot of app registration page.](../../Images/Exercise3-01.png)

1. On the registration page, in the **Platforms** section, select **Add Platform**.

    ![Screenshot of app registration page with platform highlighted.](../../Images/Exercise3-02.png)

1. In the **Add Platform** dialog, select **Web**.

1. Using the hostname from ngrok, enter a **Redirect URL** to the **auth.html** file.

    ```
    https://[replace-this].ngrok.io/auth.html
    ```

1. Select the **Add URL** button.

1. Using the hostname from ngrok, enter a **Redirect URL** to the **adminconsent.html** file.

    ```
    https://[replace-this].ngrok.io/adminconsent.html
    ```

    ![Screenshot of properties page for application registration portal.](../../Images/Exercise3-03.png)

1. Select **Save**.

1. Make note of the application ID. This value is used in the authentication / token code.

### Request permission to read groups

1. Move to the **Microsoft Graph Permissions** section.

1. Next to **Delegated Permissions**, select the **Add** button.

1. In the **Select Permission** dialog, scroll down and select **Group.Read.All**. Select **OK**.

      ![Screenshot of permissions menu in application registration portal.](../../Images/Exercise3-05.png)

1. Select **Save**.

## Ensure the gulp task is running

1. In the **Command Prompt** window, run the command `gulp manifest`. This command will create the package as a zip file in the **package** folder.

    ![Screenshot of command prompt with teams manifest zip file generation.](../../Images/Exercise1-06.png)

1. Build the webpack and start the express web server by running the following commands:

    ```shell
    gulp build
    gulp serve
    ```

    ![Screenshot of command prompt running Gulp.](../../Images/Exercise1-07.png)

    > Note: The gulp serve process must be running in order to see the tab in the Microsoft Teams application. When the process is no longer needed, press **CTRL+C** to cancel the server.

## Upload app into Microsoft Teams

Although not strictly necessary, in this demo you will add the bot to a new team.

1. In the Microsoft Teams application, select the ellipses next to the team name. Choose **Manage team** from the menu.

    ![Screenshot of Microsoft Teams with manage team menu highlighted.](../../Images/Exercise2-12.png)

1. On the manage team page, select **Apps** in the tab strip. Then select the **Upload a custom app** link at the bottom right corner of the application.

1. Select the **teams-bot1.zip** file from the **bin** folder. Select **Open**.

1. The app is displayed. Notice the description and icon for the app from the manifest is displayed.

    ![Screenshot of Microsoft Teams bot with information about the bot highlighted.](../../Images/Exercise2-13.png)

The app is now uploaded into the Microsoft Teams application and the tab is available in the **Tab Gallery**.

### Add tab to team view

1. Add the tab to a channel, or update the settings of the tab in the existing channel. To update the settings of an existing tab, select the chevron next to the tab name.

    ![Screenshot of tab menu with settings highlighted.](../../Images/Exercise3-06.png)

1. Click the **Provide administrator consent - click if Tenant Admin** button.

    ![Screenshot of teams app1 with member information displayed.](../../Images/Exercise3-07.png)

1. Verify that the Azure Active Directory login and consent flow completes. If you log in with an account that is not a tenant administrator, the consent action will fail. Admin consent is only necessary to view the group calendar, not the member information.

    ![Screenshot of Microsoft Teams consent page.](../../Images/Exercise3-08.png)

1. Select the **Get Microsoft Graph Data** button to invoke the authentication and call to **graph.microsoft.com**.

    ![Screenshot of Microsoft Teams app with a display of Office 365 data exposed via Microsoft Graph.](../../Images/Exercise3-09.png)
