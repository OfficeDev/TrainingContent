# Conversational Bot - `conversationalBot`

## How to register the bot in the Bot Framework portal

In order to create a bot you need to first register it in the [Azure portal](https://portal.azure.com/).

1. Choose to *Create a resource*, or alternatively go to an existing *resource group* and click *Add*
2. Search for *Bot channels registration* and then click *Create*
3. Give the bot a handle (ex: `conversationalBot`), choose your subscription and resource group
4. For the messaging endpoint, use this: `https://conversationalbot.azurewebsites.net/api/messages`
5. Choose to *Auto create Microsoft App ID and Password*
6. Click *Create*
7. Wait for Azure to finish its magic and when done choose to go to resource
8. On the bot page choose *Channels* and choose to add Microsoft Teams as a channel
9. Next, choose the *Settings* and click on *Manage* next to Microsoft App Id
10. In the Bot app portal, generate a new app password and store it securely - you will need them for your `.env` file or add them as application settings for the hosting web site (see below)

## How to configure the bot

The App Id and App Secret, generated during the registration, for the bot are read from the `MICROSOFT_APP_ID` and `MICROSOFT_APP_PASSWORD` environment variables, specified in the `.env` file. These can be configured in the Azure Web App under *Application Settings > App Settings*.
