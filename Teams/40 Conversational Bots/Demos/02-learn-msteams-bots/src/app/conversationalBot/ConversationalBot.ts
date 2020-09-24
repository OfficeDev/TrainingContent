import { BotDeclaration, MessageExtensionDeclaration, PreventIframe } from "express-msteams-host";
import * as debug from "debug";
import { DialogSet, DialogState } from "botbuilder-dialogs";
import { StatePropertyAccessor, CardFactory, TurnContext, MemoryStorage, ConversationState, ActivityTypes, TeamsActivityHandler, MessageFactory } from "botbuilder";
import HelpDialog from "./dialogs/HelpDialog";
import WelcomeCard from "./dialogs/WelcomeDialog";
import * as Util from "util";
const TextEncoder = Util.TextEncoder;

// Initialize debug logging module
const log = debug("msteams");

/**
 * Implementation for Conversational Bot
 */
@BotDeclaration(
  "/api/messages",
  new MemoryStorage(),
  process.env.MICROSOFT_APP_ID,
  process.env.MICROSOFT_APP_PASSWORD)

export class ConversationalBot extends TeamsActivityHandler {
  private readonly conversationState: ConversationState;
  private readonly dialogs: DialogSet;
  private dialogState: StatePropertyAccessor<DialogState>;

  /**
   * The constructor
   * @param conversationState
   */
  public constructor(conversationState: ConversationState) {
    super();

    this.conversationState = conversationState;
    this.dialogState = conversationState.createProperty("dialogState");
    this.dialogs = new DialogSet(this.dialogState);
    this.dialogs.add(new HelpDialog("help"));

    // Set up the Activity processing

    this.onMessage(async (context: TurnContext): Promise<void> => {
      // TODO: add your own bot logic in here
      switch (context.activity.type) {
        case ActivityTypes.Message:
          // if a value property exists = adaptive card submit action
          if (context.activity.value) {
            switch (context.activity.value.cardAction) {
              case "update":
                await this.updateCardActivity(context);
                break;
              case "delete":
                await this.deleteCardActivity(context);
                break;
            }
          } else {
            let text = TurnContext.removeRecipientMention(context.activity);
            text = text.toLowerCase();
            if (text.startsWith("mentionme")) {
              if (context.activity.conversation.conversationType == "personal") {
                await this.handleMessageMentionMeOneOnOne(context);
              } else {
                await this.handleMessageMentionMeChannelConversation(context);
              }
              return;
            } else if (text.startsWith("hello")) {
              await context.sendActivity("Oh, hello to you as well!");
              return;
            } else if (text.startsWith("help")) {
              const dc = await this.dialogs.createContext(context);
              await dc.beginDialog("help");
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
                  }
                ]
              });
              await context.sendActivity({ attachments: [card] });
              return;
            }
          }
          break;
        default:
          break;
      }
      // Save state changes
      return this.conversationState.saveChanges(context);
    });

    this.onConversationUpdate(async (context: TurnContext): Promise<void> => {
      if (context.activity.membersAdded && context.activity.membersAdded.length !== 0) {
        for (const idx in context.activity.membersAdded) {
          if (context.activity.membersAdded[idx].id === context.activity.recipient.id) {
            const welcomeCard = CardFactory.adaptiveCard(WelcomeCard);
            await context.sendActivity({ attachments: [welcomeCard] });
          }
        }
      }
    });

    this.onMessageReaction(async (context: TurnContext): Promise<void> => {
      if (context.activity.reactionsAdded) {
        context.activity.reactionsAdded.forEach(async (reaction) => {
          if (reaction.type === "like") {
            await context.sendActivity("Thank you!");
          }
        });
      }
    });
  }

  private async handleMessageMentionMeChannelConversation(context: TurnContext): Promise<void> {
    const mention = {
      mentioned: context.activity.from,
      text: `<at>${new TextEncoder().encode(context.activity.from.name)}</at>`,
      type: "mention"
    };

    const replyActivity = MessageFactory.text(`Hi ${mention.text}!`);
    replyActivity.entities = [mention];
    const followupActivity = MessageFactory.text(`*We are in a channel conversation*`);
    await context.sendActivities([replyActivity, followupActivity]);
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
              "text": `Updated count: ${value.count}`,
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
          "data": { cardAction: "delete" }
        }
      ]
    });

    await context.updateActivity({ attachments: [card], id: context.activity.replyToId, type: 'message' });
  }

  private async deleteCardActivity(context): Promise<void> {
    await context.deleteActivity(context.activity.replyToId);
  }
}
