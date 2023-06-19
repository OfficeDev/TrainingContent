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
    TeamsInfo,
    TurnContext
} from "botbuilder";

const TEAMS_INFO_DIALOG_ID = "teamsInfoDialog";
const TEAMS_INFO_WATERFALL_DIALOG_ID = "teamsInfoWaterfallDialog";
let teamsUserInfo;

export class TeamsInfoDialog extends ComponentDialog {
    constructor() {
        super(TEAMS_INFO_DIALOG_ID);
        this.addDialog(new TextPrompt("TextPrompt"))
            .addDialog(new WaterfallDialog(TEAMS_INFO_WATERFALL_DIALOG_ID, [
                this.introStep.bind(this),
                this.actStep.bind(this),
                this.finalStep.bind(this)
            ]));
        this.initialDialogId = TEAMS_INFO_WATERFALL_DIALOG_ID;
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
        const promptMessage = MessageFactory.text("Do you want me to send you the current Teams member info?\n\nSay **yes** if you do like to see the context or **no** if you don't");
        return await stepContext.prompt("TextPrompt", { prompt: promptMessage });
    }

    private async actStep(stepContext: WaterfallStepContext): Promise<DialogTurnResult> {
        if (stepContext.result) {
            const result = stepContext.result;
            switch (result) {
                case "yes": {
                    teamsUserInfo = await TeamsInfo.getMember(stepContext.context, stepContext.context.activity.from.id);
                    await stepContext.context.sendActivity(`Your name: **${teamsUserInfo.name}**\n\nYour Teams ID: **${teamsUserInfo.id}**\n\nYour email: **${teamsUserInfo.email}**`);
                    break;
                }
                default: {
                    await stepContext.context.sendActivity("Ok, maybe next time 😉");
                    return await stepContext.next();
                }
            }
        }
        return await stepContext.next();
    }

    private async finalStep(stepContext: WaterfallStepContext): Promise<DialogTurnResult> {
        await stepContext.context.sendActivity("Now it's time to add more functionality to your bot, so head over to the [docs](https://aka.ms/yoTeams) and start building");
        return await stepContext.endDialog();
    }
}
