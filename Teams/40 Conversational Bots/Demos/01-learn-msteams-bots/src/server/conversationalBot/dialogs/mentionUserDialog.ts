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

const MENTION_DIALOG_ID = "mentionUserDialog";
const MENTION_WATERFALL_DIALOG_ID = "mentionUserWaterfallDialog";

export class MentionUserDialog extends ComponentDialog {
    constructor() {
        super(MENTION_DIALOG_ID);
        this.addDialog(new TextPrompt("TextPrompt"))
            .addDialog(new WaterfallDialog(MENTION_WATERFALL_DIALOG_ID, [
                this.introStep.bind(this)
            ]));
        this.initialDialogId = MENTION_WATERFALL_DIALOG_ID;
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
        const mention = {
            mentioned: stepContext.context.activity.from,
            text: `<at>${new TextEncoder().encode(stepContext.context.activity.from.name)}</at>`,
            type: "mention"
        };
        const replyActivity = MessageFactory.text(`Hi ${mention.text}`);
        replyActivity.entities = [mention];
        await stepContext.context.sendActivity(replyActivity);
        return await stepContext.endDialog();
    }
}
