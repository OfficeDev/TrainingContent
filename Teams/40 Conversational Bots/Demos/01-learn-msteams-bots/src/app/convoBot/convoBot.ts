import {
  TeamsActivityHandler,
  TurnContext,
  MessageFactory,
  MemoryStorage,
  ActionTypes, CardFactory
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
}