import { BotDeclaration } from "express-msteams-host";
import * as debug from "debug";
import {
  UserState,
  ConversationState,
  SigninStateVerificationQuery,
  TurnContext,
  MemoryStorage
} from "botbuilder";
import { DialogBot } from "./DialogBot";
import { MainDialog } from "./dialogs/mainDialog";
import { SsoOAuthHelper } from "./helpers/SsoOAuthHelper";

// Initialize debug logging module
const log = debug("msteams");

@BotDeclaration(
  "/api/messages",
  new MemoryStorage(),
  // eslint-disable-next-line no-undef
  process.env.MICROSOFT_APP_ID,
  // eslint-disable-next-line no-undef
  process.env.MICROSOFT_APP_PASSWORD)
export class SsoBot extends DialogBot {
  public _ssoOAuthHelper: SsoOAuthHelper;

  constructor(conversationState: ConversationState, userState: UserState) {
    super(conversationState, userState, new MainDialog());
    this._ssoOAuthHelper = new SsoOAuthHelper();

    this.onMembersAdded(async (context, next) => {
      const membersAdded = context.activity.membersAdded;
      if (membersAdded && membersAdded.length > 0) {
        for (let cnt = 0; cnt < membersAdded.length; cnt++) {
          if (membersAdded[cnt].id !== context.activity.recipient.id) {
            await context.sendActivity("Welcome to TeamsBot. Type anything to get logged in. Type 'logout' to sign-out.");
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
    if (!await this._ssoOAuthHelper.shouldProcessTokenExchange(context)) {
      await this.dialog.run(context, this.dialogState);
    }
  }

  public async handleTeamsSigninVerifyState(context: TurnContext, query: SigninStateVerificationQuery): Promise<void> {
    await this.dialog.run(context, this.dialogState);
  }
}
