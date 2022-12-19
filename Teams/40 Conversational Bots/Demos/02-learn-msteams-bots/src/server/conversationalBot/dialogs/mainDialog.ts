import {
    ComponentDialog,
    DialogSet,
    DialogState,
    DialogTurnResult,
    DialogTurnStatus,
    TextPrompt,
    WaterfallDialog,
    WaterfallStepContext
} from "botbuilder-dialogs";
import {
  MessageFactory,
  StatePropertyAccessor,
  InputHints,
  TurnContext,
  CardFactory
} from "botbuilder";
import { TeamsInfoDialog } from "./teamsInfoDialog";
import { HelpDialog } from "./helpDialog";
import { MentionUserDialog } from "./mentionUserDialog";
import ResponseCard from "../cards/responseCard";
import * as ACData from "adaptivecards-templating";

const MAIN_DIALOG_ID = "mainDialog";
const MAIN_WATERFALL_DIALOG_ID = "mainWaterfallDialog";

export class MainDialog extends ComponentDialog {
    public onboarding: boolean;
    constructor() {
        super(MAIN_DIALOG_ID);
        this.addDialog(new TextPrompt("TextPrompt"))
            .addDialog(new TeamsInfoDialog())
            .addDialog(new HelpDialog())
            .addDialog(new MentionUserDialog())
            .addDialog(new WaterfallDialog(MAIN_WATERFALL_DIALOG_ID, [
                this.introStep.bind(this),
                this.actStep.bind(this),
                this.finalStep.bind(this)
            ]));
        this.initialDialogId = MAIN_WATERFALL_DIALOG_ID;
        this.onboarding = false;
    }

    public async run(context: TurnContext, accessor: StatePropertyAccessor<DialogState>) {
        const dialogSet = new DialogSet(accessor);
        dialogSet.add(this);
        const dialogContext = await dialogSet.createContext(context);
        const results = await dialogContext.continueDialog();
        if (results.status === DialogTurnStatus.empty) {
            await dialogContext.beginDialog(this.id);
        }
    }

    private async introStep(stepContext: WaterfallStepContext): Promise<DialogTurnResult> {
        if ((stepContext.options as any).restartMsg) {
            const messageText = (stepContext.options as any).restartMsg ? (stepContext.options as any).restartMsg : "What can I help you with today?";
            const promptMessage = MessageFactory.text(messageText, messageText, InputHints.ExpectingInput);
            return await stepContext.prompt("TextPrompt", { prompt: promptMessage });
        } else {
            this.onboarding = true;
            return await stepContext.next();
        }
    }

    private async actStep(stepContext: WaterfallStepContext): Promise<DialogTurnResult> {
        if (stepContext.result) {
            /*
            ** This is where you would add LUIS to your bot, see this link for more information:
            ** https://docs.microsoft.com/en-us/azure/bot-service/bot-builder-howto-v4-luis?view=azure-bot-service-4.0&tabs=javascript
            */
            const result = stepContext.result.trim().toLocaleLowerCase();
            switch (result) {
                case "who" :
                case "who am i?": {
                    return await stepContext.beginDialog("teamsInfoDialog");
                }
                case "get help":
                case "help": {
                    return await stepContext.beginDialog("helpDialog");
                }
                case "mention me":
                case "mention": {
                    return await stepContext.beginDialog("mentionUserDialog");
                }
                default: {
                    await stepContext.context.sendActivity("Ok, maybe next time 😉");
                    return await stepContext.next();
                }
            }
        } else if (this.onboarding) {
            if (stepContext.context.activity.conversation.conversationType === "channel") {
              TurnContext.removeRecipientMention(stepContext.context.activity);
            }

            switch (stepContext.context.activity.text) {
                case "who": {
                    return await stepContext.beginDialog("teamsInfoDialog");
                }
                case "help": {
                    return await stepContext.beginDialog("helpDialog");
                }
                case "mention me":
                case "mention": {
                    return await stepContext.beginDialog("mentionUserDialog");
                }
                default: {
                    await this.sendResponseCard(stepContext.context);
                    return await stepContext.next();
                }
            }
        }
        return await stepContext.next();
    }

    private async finalStep(stepContext: WaterfallStepContext): Promise<DialogTurnResult> {
      if (stepContext.context.activity.conversation.conversationType !== "channel") {
        return await stepContext.replaceDialog(this.initialDialogId, { restartMsg: "What else can I do for you?" });
      } else {
        return await stepContext.endDialog();
      }
    }

    private async sendResponseCard(turnContext: TurnContext): Promise<void> {
      const cardData = {
        message: "Demonstrates how to respond with a card, update the card & ultimately delete the response.",
        count: 0
      };
      const template = new ACData.Template(ResponseCard);
      const context: ACData.IEvaluationContext = {
        $root: cardData
      };
      const acCard = template.expand(context);
      const attachment = CardFactory.adaptiveCard(acCard);
      await turnContext.sendActivity({ attachments: [attachment] });
    }

}
