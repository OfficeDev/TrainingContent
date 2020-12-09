# Teams Webhooks Outgoing Webhook - `teamsWebhooksOutgoingWebhook`

## How to add the Outgoing Webhook to a Teams team

To add the Teams Webhooks Outgoing Webhook to a Microsoft Teams team, choose *View Team* and then choose the *Bots* tab. In the lower right corner click on *Create a outgoing webhook*. Then fill in the name, the URL (`https://teamswebhooks.azurewebsites.net/api/webhook`) and a description and click ok. Once the outgoing webhook is registered you will receive a _Security token_. Save this token in a secure place for future use, and you wil not be able to retrieve it again. 

### Security token usage

The security token must be added as an environment variable. For development purposes it can be added to the `.env` file with the property name `SECURITY_TOKEN` and for Azure you should add it as a new environment variable called `SECURITY_TOKEN`. These can be configured in the Azure Web App under *Application Settings > App Settings*.

## Notes

You might receive an error the first time you send a message to the bot, if you just deployed the solution. Outgoing webhooks must answer within 5 seconds.
