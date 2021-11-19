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
    TurnContext
} from "botbuilder";

const HELP_DIALOG_ID = "helpDialog";
const HELP_WATERFALL_DIALOG_ID = "helpWaterfallDialog";

export class HelpDialog extends ComponentDialog {
    constructor() {
        super(HELP_DIALOG_ID);
        this.addDialog(new TextPrompt("TextPrompt"))
            .addDialog(new WaterfallDialog(HELP_WATERFALL_DIALOG_ID, [
                this.introStep.bind(this)
            ]));
        this.initialDialogId = HELP_WATERFALL_DIALOG_ID;
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
        const message = MessageFactory.text("I am terribly sorry, but my developer hasn't trained me to do anything yet 😂. Please refer to [this link](https://docs.microsoft.com/en-us/microsoftteams/platform/bots/what-are-bots) to see how to develop bots for Teams");
        await stepContext.context.sendActivity(message);
        return await stepContext.endDialog();
    }
}
