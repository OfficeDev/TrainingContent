import {
  ActivityTypes,
  BotFrameworkAdapter
} from "botbuilder";
import {
  ComponentDialog,
  DialogContext,
  DialogTurnResult
} from "botbuilder-dialogs";

export class LogoutDialog extends ComponentDialog {
  constructor(dialogId: string, public ssoConnectionName: string) {
    super(dialogId);
  }

  public async onBeginDialog(innerDialogContext: DialogContext, options): Promise<DialogTurnResult> {
    const result = await this.interrupt(innerDialogContext);
    if (result) {
      return result;
    }
    return await super.onBeginDialog(innerDialogContext, options);
  }

  public async onContinueDialog(innerDialogContext: DialogContext): Promise<DialogTurnResult> {
    const result = await this.interrupt(innerDialogContext);
    if (result) {
      return result;
    }
    return await super.onContinueDialog(innerDialogContext);
  }

  public async interrupt(innerDialogContext: DialogContext): Promise<DialogTurnResult | void> {
    if (innerDialogContext.context.activity.type === ActivityTypes.Message) {
      const text = innerDialogContext.context.activity.text.toLowerCase().replace(/\r?\n|\r/g, '');

      if (text === 'logout') {
        // sign out
        const botAdapter = innerDialogContext.context.adapter as BotFrameworkAdapter;
        await botAdapter.signOutUser(innerDialogContext.context, this.ssoConnectionName);

        // notify user
        await innerDialogContext.context.sendActivity('You have been signed out.');

        // cancel dialog stack
        return await innerDialogContext.cancelAllDialogs();
      } else {
        return;
      }
    }
  }
}