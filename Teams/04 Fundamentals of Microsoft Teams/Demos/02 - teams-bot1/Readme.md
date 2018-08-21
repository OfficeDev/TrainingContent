# Demo - Section 2: Build a basic Microsoft Teams Bot

To run this demo:

1. Download and install the [bot application template](https://marketplace.visualstudio.com/items?itemName=BotBuilder.BotBuilderV3). The extension can be installed by double-clicking on the VSIX file.

2. Perform the following steps from the lab

## Download NuGet packages

1. Launch Visual Studio 2017 as an administrator
1. In Visual Studio 2017, select **File > Open > Project/Solution**. Select the `teams-bot1.sln` from the `Demos` folder.

## Configure URL

1. In Solution Explorer, double-click on **Properties**
1. In the Properties designer, select the **Web** tab.
1. Note the Project URL.

    ![Screenshot of team bot properties highlighting URL](../../Images/Exercise2-02.png)

## Run the ngrok secure tunnel application

1. Open a new **Command Prompt** window.

1. Change to the directory that contains the **ngrok.exe** application.

1. Run the command `ngrok http [port] -host-header=localhost:[port]` Replace `port` with the port portion of the URL noted above.

1. The ngrok application will fill the entire prompt window. Make note of the forwarding address using HTTPS. This address is required in the next step.

1. Minimize the ngrok command prompt window. It is no longer referenced in this lab, but it must remain running.

    ![Screenshot of command prompt with local host highlighted.](Images/Exercise2-03.png)

## Register the bot

1. Go to the [Microsoft Bot Framework create page](https://dev.botframework.com/bots/new) at https://dev.botframework.com/bots/new. (Do not use the Create button on the Bot Framework portal home page, as this will redirect to the Azure Portal.) Sign in with your work or school account. If necessary, accept the Terms of service.

1. Complete the bot profile section, entering a display name, unique bot handle and description.

    ![Screenshot of bot profile form.](../../Images/Exercise2-04.png)

1. Complete the configuration section.
    - For the **Messaging endpoint**, use the forwarding HTTPS address from ngrok with `/api/messages` appended to provide the route to the **MessagesController** in the Visual Studio project. In the example, this is `https://a2632edd.ngrok.io/api/messages`.
    - Select the **Create Microsoft App ID and password button** to open a new browser window.
    - In the new browser window the application is registered in Azure Active Directory. Select **Generate an app password to continue**. An app secret is generated. Copy the secret and save it. You will use it in a subsequent step.
    - Select **OK** to close the dialogue box.
    - Select the **Finish and go back to Bot Framework** button to close the new browser window and populate the app ID in the **Paste your app ID below to continue textbox**.

        ![Screenshot of configuration form for teams bot.](../../Images/Exercise2-05.png)

1. Move to the bottom of the page. Agree to the privacy statement, terms of use, and code of conduct and select the **Register** button. Once the bot is created, select **OK** to dismiss the dialogue box. The **Connect to channels** page is displayed for the newly-created bot.

**Note:** The Bot migration message (shown in red) can be ignored for Microsoft Teams bots.

1. The bot must then be connected to Microsoft Teams. Select the **Teams** logo.

    ![Screenshot of channel menu with Microsoft Teams icon highlighted.](../../Images/Exercise2-06.png)

1. When the connection is complete, ensure the connection is enabled and select **Done**.

    ![Screenshot of MSTeams bot confirmation page.](../../Images/Exercise2-07.png)

    The bot registration is complete. Selecting **Settings** in the top navigation will re-display the profile and configuration sections. This can be used to update the messaging endpoint in the event ngrok is stopped, or the bot is moved to production.

## Configure the web project

The bot project must be configured with information from the registration.

1. In Visual Studio, open the **Web.config** file. Locate the `<appSettings>` section.

1. Enter the `BotId` value. The `BotId` is the **Bot handle** from the **Configuration** section of the registration.

1. Enter the `MicrosoftAppId`. The `MicrosoftAppId` is the app ID from the **Configuration** section of the registration.

1. Enter the `MicrosoftAppPassword`. The `MicrosoftAppPassword` is the auto-generated app secret displayed in the dialogue box during registration. If you do not have the app secret, the bot must be deleted and re-registered. An app secret cannot be reset nor displayed.

1. Press **F5** to run the project. This will update the package (a zip file) in the build output folder (`bin\\`).

## Upload app into Microsoft Teams

Although not strictly necessary, in this demo you will add the bot to a new team.

1. In the Microsoft Teams application, select the ellipses next to the team name. Choose **Manage team** from the menu.

    ![Screenshot of Microsoft Teams with manage team menu highlighted.](Images/Exercise2-12.png)

1. On the manage team page, select **Apps** in the tab strip. Then select the **Upload a custom app** link at the bottom right corner of the application.

1. Select the **teams-bot1.zip** file from the **bin** folder. Select **Open**.

1. The app is displayed. Notice the description and icon for the app from the manifest is displayed.

    ![Screenshot of Microsoft Teams bot with information about the bot highlighted.](Images/Exercise2-13.png)

    The app is now uploaded into the Microsoft Teams application and the bot is available.

### Interact with the bot

1. In the general channel for the team, a message is created announcing the bot has been added to the team. To interact with the bot, @ mention the bot.

    ![Screenshot of Microsoft Teams displaying welcome page.](../../Images/Exercise2-14.png)

1. As you test the bot, you will notice that the character count is not correct. You can set breakpoints in the Visual Studio project to debug the code. (Remember, however, that the count was correct using the registration portal.) Later modules of this training will review how to remove mentions from the message.
