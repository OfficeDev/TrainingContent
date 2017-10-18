# Demo - Section 3: Build a Microsoft Teams Tab

To run this demo, perform the following steps from the lab:

## Complete the prerequisites from the lab

1. Install developer tools
1. Install NodeJS and npm
1. Install Yeoman and gulp
1. Download ngrok

## Run the ngrok secure tunnel application

1. Open a new **Command Prompt** window.
1. Change to the directory that contains the ngrok.exe application.
1. run the command `ngrok http 3007`
1. The ngrok application will fill the entire prompt window. Make note of the Forwarding address using https. This address is required in the next step.
1. Minimize the ngrok Command Prompt window. It is no longer referenced in this exercise, but it must remain running.

## Register an application in AAD

To enable an application to call the Microsoft Graph, an application registration is required. This lab uses the [Azure Active Directory v2.0 endpoint](https://docs.microsoft.com/en-us/azure/active-directory/develop/active-directory-v2-compare).

1. Open a browser to the url **https://apps.dev.microsoft.com**
1. Log in with a Work or School account.
1. Click **Add an app**
1. Complete the **Register your application** section, entering an Application name and Contact email. Clear the checkbox for Guided Setup. Click **Create**

    ![](../../Images/Exercise3-01.png)

1. On the registration page, in the **Platforms** section, click **Add Platform**.

    ![](../../Images/Exercise3-02.png)

1. In the **Add Platform** dialog, click **Web**.
1. Using the hostname from ngrok, enter a **Redirect URL** to the `auth.html` file.

    ```url
    https://[replace-this].ngrok.io/auth.html
    ```

1. Click the **Add URL** button.
1. Using the hostname from ngrok, enter a **Redirect URL** to the `adminconsent.html` file.

    ```url
    https://[replace-this].ngrok.io/adminconsent.html
    ```

    ![](../../Images/Exercise3-03.png)

1. Click **Save**.
1. Make note of the Application Id. This value is used in the authentication / token code.
1. Request permission to read Groups.

    1. Scroll down to the **Microsoft Graph Permissions** section.
    1. Next to **Delegated Permissions**, click the **Add** button.
    1. In the **Select Permission** dialog, scroll down and select **Group.Read.All**. Click **OK**.

        ![](../../Images/Exercise3-05.png)

    1. Click **Save**.

## Update the manifest and build the package

1. Open the **manifest.json** file in the **manifest** folder.
1. Replace all instances of **tbd.ngrok.io** with the HTTPS Forwarding address from the ngrok window. (In this example, the forwarding address is **https://0f3b4f62.ngrok.io**.) There are 6 URLs that need to be changed.
1. Save the **manifest.json** file.
1. In the **Command Prompt** window, run the command `gulp manifest`. This command will create the package as a zip file in the **package** folder

    ![](../../Images/Exercise1-06.png)

1. Build the webpack and start the Express web server by running the following commands:

    ```shell
    gulp build
    gulp serve
    ```

    ![](../../Images/Exercise1-07.png)

    > Note: The gulp serve process must be running in order to see the tab in the Teams application. When the process is no longer needed, press `CTRL+C` to cancel the server.

## Sideload app into Microsoft Teams

1. In the Microsoft Teams application, click the **Add team** link. Then click the **Create team** button.

    ![](../../Images/Exercise1-08.png)

1. Enter a team name and description. In this example, the Team is named **teams-app-1**. Click **Next**.
1. Optionally, invite others from your organization to the team. This step can be skipped in this lab.
1. The new team is shown. In the left-side panel, click the ellipses next to the team name. Choose **View team** from the context menu.

    ![](../../Images/Exercise1-09.png)

1. On the View team display, click **Apps** in the tab strip. Then click the **Sideload an app** link at the bottom right corner of the application.

    ![](../../Images/Exercise1-10.png)

1. Select the **teams-app-1.zip** file from the **package** folder. Click **Open**.

    ![](../../Images/Exercise1-11.png)

1. The app is displayed. Notice information about the app from the manifest (Description and Icon) is displayed.

    ![](../../Images/Exercise1-12.png)
