import {
  TeamsActivityHandler,
  TurnContext,
  MessageFactory,
  MemoryStorage,
  ActionTypes, CardFactory,
  ChannelInfo, TeamsChannelData, ConversationParameters, teamsGetChannelId,
  Activity, BotFrameworkAdapter, ConversationReference, ConversationResourceResponse
} from "botbuilder";

import * as Util from "util";
const TextEncoder = Util.TextEncoder;

import * as debug from "debug";
const log = debug("msteams");

export class ConvoBot extends TeamsActivityHandler {
  constructor() {
    super();

    this.onMessage(async (context: TurnContext, next: () => Promise<void>) => {
      // if a value property exists = adaptive card submit action
      if (context.activity.value) {
        switch (context.activity.value.cardAction) {
          case "update":
            await this.updateCardActivity(context);
            break;
          case "delete":
            await this.deleteCardActivity(context);
            break;
          case "newconversation":
            const channelId = teamsGetChannelId(context.activity);
            const message = MessageFactory.text("This will be the first message in a new thread");
            const newConversation = await this.createConversationInChannel(context, channelId, message);
            break;
        }
      } else {
        const botMessageText: string = context.activity.text.trim().toLowerCase();

        if (botMessageText === "mentionme") {
          await this.handleMessageMentionMeOneOnOne(context);
        } else if (botMessageText.endsWith("</at> mentionme")) {
          await this.handleMessageMentionMeChannelConversation(context);
        } else {
          const value = { cardAction: "update", count: 0 };
          const card = CardFactory.adaptiveCard({
            "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
            "type": "AdaptiveCard",
            "version": "1.0",
            "body": [
              {
                "type": "Container",
                "items": [
                  {
                    "type": "TextBlock",
                    "text": "Adaptive card response",
                    "weight": "bolder",
                    "size": "large"
                  }
                ]
              },
              {
                "type": "Container",
                "items": [
                  {
                    "type": "TextBlock",
                    "text": "Demonstrates how to respond with a card, update the card & ultimately delete the response.",
                    "wrap": true
                  }
                ]
              }
            ],
            "actions": [
              {
                "type": "Action.Submit",
                "title": "Update card",
                "data": value
              },
              {
                "type": "Action.Submit",
                "title": "Create new thread in this channel",
                "data": { cardAction: "newconversation" }
              }
            ]
          });
          await context.sendActivity({ attachments: [card] });
        }
      }
      await next();
    });

    this.onReactionsAdded(async (context: TurnContext, next: () => Promise<void>) => {
      if (context.activity.reactionsAdded) {
        context.activity.reactionsAdded.forEach(async (reaction) => {
          if (reaction.type === 'like') {
            await context.sendActivity(`Thank you!`);
          }
        });
      }
      await next();
    });
  }

  private async handleMessageMentionMeOneOnOne(context: TurnContext): Promise<void> {
    const mention = {
      mentioned: context.activity.from,
      text: `<at>${new TextEncoder().encode(context.activity.from.name)}</at>`,
      type: "mention"
    };

    const replyActivity = MessageFactory.text(`Hi ${mention.text} from a 1:1 chat.`);
    replyActivity.entities = [mention];
    await context.sendActivity(replyActivity);
  }

  private async handleMessageMentionMeChannelConversation(context: TurnContext): Promise<void> {
    const mention = {
      mentioned: context.activity.from,
      text: `<at>${new TextEncoder().encode(context.activity.from.name)}</at>`,
      type: "mention"
    };

    const replyActivity = MessageFactory.text(`Hi ${mention.text}!`);
    replyActivity.entities = [mention];
    const followupActivity = MessageFactory.text(`*We are in a channel conversation group chat!*`);
    await context.sendActivities([replyActivity, followupActivity]);
  }

  private async updateCardActivity(context): Promise<void> {
    const value = {
      cardAction: "update",
      count: context.activity.value.count + 1
    };
    const card = CardFactory.adaptiveCard({
      "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
      "type": "AdaptiveCard",
      "version": "1.0",
      "body": [
        {
          "type": "Container",
          "items": [
            {
              "type": "TextBlock",
              "text": "Adaptive card response",
              "weight": "bolder",
              "size": "large"
            }
          ]
        },
        {
          "type": "Container",
          "items": [
            {
              "type": "TextBlock",
              "text": `Updated count: ${ value.count }`,
              "wrap": true
            }
          ]
        }
      ],
      "actions": [
        {
          "type": "Action.Submit",
          "title": "Update card",
          "data": value
        },
        {
          "type": "Action.Submit",
          "title": "Delete card",
          "data": { cardAction: "delete"}
        }
      ]
    });

    await context.updateActivity({ attachments: [card], id: context.activity.replyToId, type: 'message' });
  }

  private async deleteCardActivity(context): Promise<void> {
    await context.deleteActivity(context.activity.replyToId);
  }

  private async createConversationInChannel(context: TurnContext, teamsChannelId: string, message: Partial<Activity>): Promise<[ConversationReference, string]> {
    // create parameters for the new conversation
    const conversationParameters = <ConversationParameters>{
      isGroup: true,
      channelData: <TeamsChannelData>{
        channel: <ChannelInfo>{
          id: teamsChannelId
        }
      },
      activity: message
    };

    // get a reference to the bot adapter & create a connection to the Teams API
    const adapter = <BotFrameworkAdapter>context.adapter;
    const connectorClient = adapter.createConnectorClient(context.activity.serviceUrl);

    // create a new conversation and get a reference to it
    const conversationResourceResponse: ConversationResourceResponse = await connectorClient.conversations.createConversation(conversationParameters);
    const conversationReference = <ConversationReference>TurnContext.getConversationReference(context.activity);
    conversationReference.conversation.id = conversationResourceResponse.id;

    return [conversationReference, conversationResourceResponse.activityId];
  }
}