import { BotDeclaration } from "express-msteams-host";
import * as debug from "debug";
import {
  AdaptiveCardInvokeValue,
  AdaptiveCardInvokeResponse,
  StatusCodes,
  CardFactory,
  ConversationState,
  MemoryStorage,
  UserState,
  TurnContext
} from "botbuilder";
import { DialogBot } from "./dialogBot";
import { MainDialog } from "./dialogs/mainDialog";
import WelcomeCard from "./cards/welcomeCard";
import ResponseCard from "./cards/responseCard";
import * as ACData from "adaptivecards-templating";

// Initialize debug logging module
const log = debug("msteams");

/**
 * Implementation for Conversational Bot Bot
 */
@BotDeclaration(
  "/api/messages",
  new MemoryStorage(),
  // eslint-disable-next-line no-undef
  process.env.MICROSOFT_APP_ID,
  // eslint-disable-next-line no-undef
  process.env.MICROSOFT_APP_PASSWORD)

export class ConversationalBotBot extends DialogBot {
  constructor(conversationState: ConversationState, userState: UserState) {
    super(conversationState, userState, new MainDialog());

    this.onMembersAdded(async (context, next) => {
      const membersAdded = context.activity.membersAdded;
      if (membersAdded && membersAdded.length > 0) {
        for (let cnt = 0; cnt < membersAdded.length; cnt++) {
          if (membersAdded[cnt].id !== context.activity.recipient.id) {
            await this.sendWelcomeCard(context);
          }
        }
      }
      await next();
    });

    this.onMessageReaction(async (context, next) => {
      try {
        if (context.activity.reactionsAdded) {
          context.activity.reactionsAdded.forEach(async (reaction) => {
            if (reaction.type === "like") {
              await context.sendActivity("Thank you!");
            }
          });
        }
        await next();
      } catch (error) {
        log("onMessageReaction: error\n", error);
      }
    });
  }

  public async sendWelcomeCard(context: TurnContext): Promise<void> {
    const welcomeCard = CardFactory.adaptiveCard(WelcomeCard);
    await context.sendActivity({ attachments: [welcomeCard] });
  }

  protected async onAdaptiveCardInvoke(context: TurnContext, invokeValue: AdaptiveCardInvokeValue): Promise<any> {
    let cardResponse: AdaptiveCardInvokeResponse;

    try {
      const verb = invokeValue.action.verb;
      switch (verb) {
        case "update":
          {
            let clickCount: number = invokeValue.action.data.count as number;
            const cardData = {
              message: `Updated count: ${++clickCount}`,
              count: clickCount,
              showDelete: true
            };
            const template = new ACData.Template(ResponseCard);
            const context: ACData.IEvaluationContext = {
              $root: cardData
            };
            const acCard = template.expand(context);

            cardResponse = {
              statusCode: StatusCodes.OK,
              type: "application/vnd.microsoft.card.adaptive",
              value: acCard
            } as unknown as AdaptiveCardInvokeResponse;

          }
          break;

        case "delete":
          await context.deleteActivity(context!.activity!.replyToId!);
          return Promise.resolve({
            statusCode: 200,
            type: "application/vnd.microsoft.activity.message",
            value: "Deleting activity..."
          });

        default:
          return Promise.resolve({
            statusCode: 200,
            type: "application/vnd.microsoft.activity.message",
            value: "I don't know how to process that verb"
          });
      }
      return Promise.resolve(cardResponse);
    } catch (error) {
      return Promise.reject(error);
    }
  }

}
