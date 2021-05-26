import { DialogBot } from "./DialogBot";
import { MainDialog } from "./dialogs/mainDialog";
import {
  ConversationState,
  UserState,
  SigninStateVerificationQuery,
  TurnContext
} from "botbuilder";
import { SsoOAuthHelper } from "./helpers/SsoOauthHelper";

export class SsoBot extends DialogBot {
  public _ssoOAuthHelper: SsoOAuthHelper;

  constructor(conversationState: ConversationState, userState: UserState) {
    super(conversationState, userState, new MainDialog());
    this._ssoOAuthHelper = new SsoOAuthHelper(process.env.SSO_CONNECTION_NAME as string, conversationState);

    this.onMembersAdded(async (context, next) => {
      const membersAdded = context.activity.membersAdded;
      if (membersAdded && membersAdded.length > 0) {
        for (let cnt = 0; cnt < membersAdded.length; cnt++) {
          if (membersAdded[cnt].id !== context.activity.recipient.id) {
            await context.sendActivity('Welcome to TeamsBot. Type anything to get logged in. Type \'logout\' to sign-out.');
          }
        }
      }
      await next();
    });

    this.onTokenResponseEvent(async (context) => {
      await this.dialog.run(context, this.dialogState);
    });
  }

  public async handleTeamsSigninTokenExchange(context: TurnContext, query: SigninStateVerificationQuery): Promise<void> {
    if (await this._ssoOAuthHelper.shouldProcessTokenExchange(context)) {
      return;
    } else {
      await this.dialog.run(context, this.dialogState);
    }
  }

  public async handleTeamsSigninVerifyState(context: TurnContext, query: SigninStateVerificationQuery): Promise<void> {
    await this.dialog.run(context, this.dialogState);
  }
}