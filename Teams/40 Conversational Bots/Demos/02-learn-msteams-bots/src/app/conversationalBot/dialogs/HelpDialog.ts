import { Dialog, DialogContext, DialogTurnResult } from "botbuilder-dialogs";

export default class HelpDialog extends Dialog {
    constructor(dialogId: string) {
        super(dialogId);
    }

    public async beginDialog(context: DialogContext, options?: any): Promise<DialogTurnResult> {
        context.context.sendActivity(`I'm just a friendly but rather stupid bot, and right now I don't have any valuable help for you!`);
        return await context.endDialog();
    }
}
