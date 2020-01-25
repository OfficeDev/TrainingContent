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
      const botMessageText: string = context.activity.text.trim().toLowerCase();

      if (botMessageText === "mentionme") {
        await this.handleMessageMentionMeOneOnOne(context);
      } else if (botMessageText.endsWith("</at> mentionme")) {
        await this.handleMessageMentionMeChannelConversation(context);
      } else if (botMessageText === "updatecardaction") {
        await this.updateCardActivity(context);
      } else if (botMessageText === "deletecardaction") {
        await this.deleteCardActivity(context);
      } else if (botMessageText === "newconversation") {
        const channelId = teamsGetChannelId(context.activity);
        const message = MessageFactory.text("This will be the first message in a new thread");
        const newConversation = await this.createConversationInChannel(context, channelId, message);
      } else {
        const value = { count: 0 };
        const card = CardFactory.heroCard(
          "Adaptive card response",
          "Demonstrates how to respond with a card, update the card & ultimately delete the response.",
          [],
          [
            {
              type: ActionTypes.MessageBack,
              title: "Update card",
              value: value,
              text: "UpdateCardAction"
            },
            {
              type: ActionTypes.MessageBack,
              title: "Create new thread in this channel",
              value: value,
              text: "newconversation"
            }
          ]
        );
        await context.sendActivity({ attachments: [card] });
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
    const data = context.activity.value;
    data.count += 1;

    const card = CardFactory.heroCard(
      "Adaptive card response",
      `Updated count: ${data.count}`,
      [],
      [
        {
          type: ActionTypes.MessageBack,
          title: 'Update Card',
          value: data,
          text: 'UpdateCardAction'
        },
        {
          type: ActionTypes.MessageBack,
          title: 'Delete card',
          value: null,
          text: 'DeleteCardAction'
        }
      ]);

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