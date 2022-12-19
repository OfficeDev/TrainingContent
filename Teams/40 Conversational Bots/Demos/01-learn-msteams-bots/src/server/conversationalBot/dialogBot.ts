import {
    ConversationState,
    UserState,
    TeamsActivityHandler,
    TurnContext
} from "botbuilder";
import { MainDialog } from "./dialogs/mainDialog";

export class DialogBot extends TeamsActivityHandler {
    public dialogState: any;

    constructor(public conversationState: ConversationState, public userState: UserState, public dialog: MainDialog) {
        super();
        this.conversationState = conversationState;
        this.userState = userState;
        this.dialog = dialog;
        this.dialogState = this.conversationState.createProperty("DialogState");

        this.onMessage(async (context, next) => {
            // Run the MainDialog with the new message Activity.
            await this.dialog.run(context, this.dialogState);
            await next();
        });
    }

    public async run(context: TurnContext) {
        await super.run(context);
        // Save any state changes. The load happened during the execution of the Dialog.
        await this.conversationState.saveChanges(context, false);
        await this.userState.saveChanges(context, false);
    }
}
