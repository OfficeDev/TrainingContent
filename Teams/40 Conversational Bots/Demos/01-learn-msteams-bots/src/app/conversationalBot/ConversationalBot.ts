import { BotDeclaration, MessageExtensionDeclaration, PreventIframe } from "express-msteams-host";
import * as debug from "debug";
import { DialogSet, DialogState } from "botbuilder-dialogs";
import {
  StatePropertyAccessor,
  CardFactory,
  TurnContext,
  MemoryStorage,
  ConversationState,
  ActivityTypes,
  TeamsActivityHandler,
  MessageFactory,
} from 'botbuilder';
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
          let text = TurnContext.removeRecipientMention(context.activity);
          text = text.toLowerCase();
          if (text.startsWith("mentionme")) {
            await this.handleMessageMentionMeOneOnOne(context);
            return;
          } else if (text.startsWith("hello")) {
            await context.sendActivity("Oh, hello to you as well!");
            return;
          } else if (text.startsWith("help")) {
            const dc = await this.dialogs.createContext(context);
            await dc.beginDialog("help");
          } else {
            await context.sendActivity(`I\'m terribly sorry, but my master hasn\'t trained me to do anything yet...`);
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
      const added = context.activity.reactionsAdded;
      if (added && added[0]) {
        await context.sendActivity({
          textFormat: "xml",
          text: `That was an interesting reaction (<b>${added[0].type}</b>)`
        });
      }
    });;
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

}
