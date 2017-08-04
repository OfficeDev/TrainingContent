# Demo - Section 2: Create a Compose Extension

To run this demo, perform the following steps from the lab:

## Download NuGet packages

1. Launch Visual Studio 2017 as an administrator

4. Build the solution to download all configured NuGet packages.

## Configure URL

1. In Solution Explorer, double-click on Properties

2. In the Properties designer, select the Web tab.
3. Note the Project URL.

    ![](../../Images/Exercise1-02.png)

### Run the ngrok secure tunnel application

1. Open a new **Command Prompt** window.
2. Change to the directory that contains the ngrok.exe application.
3. Run the command `ngrok http [port] -host-header=localhost:[port]` (Replace [port] with the port portion of the URL noted above.)
4. The ngrok application will fill the entire prompt window. Make note of the Forwarding address using https. This address is required in the next step.
5. Minimize the ngrok Command Prompt window. It is no longer referenced in this lab, but it must remain running.

	![](../../Images/Exercise1-03.png)

### Register the bot ###


1. Go to the Microsoft Bot Framework portal at https://dev.botframework.com and sign in. (The bot registration portal accepts a Work or School Account or a Microsoft Account.)
2. Click Register. (If the Register button is not shown, click **My bots** in the top navigation.)
3. Complete the Bot profile section, entering a Display name, Bot handle and description.

    ![](../../Images/Exercise1-04.png)

4. Complete the Configuration section.

    1. For the Messaging endpoint, use the Forwarding https address from ngrok prepended to the route to the MessagesController in the Visual Studio project. In the example, this is `https://a2632edd.ngrok.io/API/Messages`.

    2. Click the **Create Microsoft App ID and password button**. This opens a new browser tab/window.

    3. In the new browser tab/window the application is registered in Azure Active Directory. Click **Generate an app password to continue**.

    4. An app password is generated. Copy the password and save it. You will use it in a subsequent step.

    5. Click **OK**. This closes the popup.

    6. Click the **Finish and go back to Bot Framework** button. This closes the new browser tab/window and populates the app Id in the **Paste your app ID below to continue textbox**.

        ![](Images/Exercise1-05.png)

5. Scroll to the bottom of the page. Agree to the Privacy statement, Terms of use, and Code of conduct and click the **Register** button. Once the Bot is created, click **OK** to dismiss the pop-up.

The **Connect to channels** page is displayed for the newly-created bot. The bot must be connected to Microsoft Teams.

1. Click the Teams logo.

    ![](../../Images/Exercise1-06.png)

2. Once the connection is complete, ensure the connection is Enabled and click **Done**

    ![](../../Images/Exercise1-07.png)

The bot registration is complete.

### Configure the web project
The bot project must be configured with information from the registration.

1. In Visual Studio, open the Web.config file. Locate the `<appSettings>` section.

2. Enter the BotId value. the BotId is the **Bot handle** from the **Configuration** section of the registration.
3. Enter the MicrosoftAppId. The MicrosoftAppId is the app ID from the **Configuration** section of the registration.
4. Enter the MicrosoftAppPassword. The MicrosoftAppPassword is the auto-generated app password displayed in the pop-up during registration.
    > If you do not have the app password, the bot must be deleted and re-registered. An app password cannot be reset nor displayed.


### Configure Visual Studio to Package bot

Packaging a bot for Microsoft Teams requires that a manifest file (and related resources) are compressed into a zip file and added to a team.

1. Open the **manifest.json** file in the **Manifest** folder.

    The manifest.json file requires several updates:
    - The **id** property must contain the app ID from registration. Replace the token `[microsoft-app-id]` with the app ID.
    - The **packageName** property must contain a unique identifier. The convention is to use the bot's URL in reverse format. Replace the token `[from-ngrok]` with the unique identifier from the Forwarding address.
    - Similarly, the **developer** property has three URLs that should match the hostname of the Messaging endpoint. Replace the token `[from-ngrok]` with the unique identifier from the Forwarding address.
    - The **botId** property (in the **bots** collection property) also requires the app ID from registration. Replace the token `[microsoft-app-id]` with the app ID.
    - Save and close the manifest.json file.

5. Press **Ctrl+Shift_B** to build the project. The build will create a zip file in the build output folder (bin\\).


### Sideload app into Microsoft Teams ###
1. In the Microsoft Teams application, in the left-side panel, click the elipses next to the team name. Choose **View team** from the context menu.

    ![](../../Images/Exercise1-12.png)


5. On the View team display, click **Apps** in the tab strip. Then click the **Sideload an app** link at the bottom right corner of the application.

6. Select the zip file (**teams-bot1.zip** in this example) from the *bin* folder. Click Open.

7. The app is displayed. Notice information about the app from the manifest (Description and Icon) is displayed.

    ![](../../Images/Exercise1-13.png)

The app is now sideloaded into the Microsoft Teams application and the bot is available.

### Invoke the Compose Extension

The Compose Extension is configured for use in a Channel (due to the scopes entered in the manifest.) The extension is invoked by clicking the elipsis below the compose box and selecting the bot.

![](../../Images/Exercise2-01.png)

![](../../Images/Exercise2-02.png)

![](../../Images/Exercise2-03.png)