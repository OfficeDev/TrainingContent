# Adaptive Cards in Microsoft Teams

In this demo

## View

1. In a channel, @ message the bot and issue the command `candidate details John Smith 0F812D01`. The command must include a given name, a surname and a string as job identifier.

1. The bot will reply with an adaptive card showing candidate details. The candidate information is generated randomly and may change each time. The buttons are not implemented.

1. Show the `MessagesController` class. Highlight the code block at lines 44-52 that determine if the activity represents a messaging extension request. Point out that this code block returns the messaging extension results in the body of the response (line 51). This is different than other operations performed by the bot, which simply return a status (line 58).

1. Review the `MessagingExtensionHelper.cs` file, pointing out the code used to respond to messaging extension requests.