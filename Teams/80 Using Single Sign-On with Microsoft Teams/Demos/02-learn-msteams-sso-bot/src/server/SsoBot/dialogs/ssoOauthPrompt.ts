import {
  ActivityTypes,
  StatusCodes,
  TokenResponse
} from "botbuilder";
import {
  DialogContext,
  DialogTurnResult,
  OAuthPrompt
} from "botbuilder-dialogs";
import jwtDecode from "jwt-decode";

export class TokenExchangeInvokeResponse {
  id: string;
  connectionName: string;
  failureDetail: string;

  constructor(id: string, connectionName: string, failureDetail: string) {
    this.id = id;
    this.connectionName = connectionName;
    this.failureDetail = failureDetail;
  }
}

export class SsoOauthPrompt extends OAuthPrompt {
  public async continueDialog(dialogContext: DialogContext): Promise<DialogTurnResult> {
    // if token previously successfully exchanged, it should be cached in
    //  TurnState along with the TokenExchangeInvokeRequest
    const cachedTokenResponse = dialogContext.context.turnState.get("tokenExchangeResponse");

    if (cachedTokenResponse) {
      const tokenExchangeRequest = dialogContext.context.turnState.get("tokenExchangeInvokeRequest");
      if (!tokenExchangeRequest) {
        throw new Error("TokenResponse is present in TurnState, but TokenExchangeInvokeRequest is missing.");
      }

      // TokenExchangeInvokeResponse
      const exchangeResponse = new TokenExchangeInvokeResponse(tokenExchangeRequest.id, process.env.SSO_CONNECTION_NAME as string, tokenExchangeRequest.failureDetail);

      await dialogContext.context.sendActivity({
        type: ActivityTypes.InvokeResponse,
        value: {
          status: StatusCodes.OK,
          body: exchangeResponse
        }
      });

      const result: TokenResponse = {
        channelId: cachedTokenResponse.channelId,
        connectionName: process.env.SSO_CONNECTION_NAME as string,
        token: cachedTokenResponse.token,
        expiration: new Date(jwtDecode<any>(cachedTokenResponse.token).exp).toISOString()
      };

      return await dialogContext.endDialog(result);
    }

    return await super.continueDialog(dialogContext);
  }
}
