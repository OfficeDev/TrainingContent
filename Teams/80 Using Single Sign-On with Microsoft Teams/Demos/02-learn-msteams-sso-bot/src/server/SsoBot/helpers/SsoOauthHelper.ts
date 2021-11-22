import {
  ActivityTypes,
  BotFrameworkAdapter,
  ConversationState,
  StatusCodes,
  tokenExchangeOperationName,
  TokenResponse,
  TurnContext
} from "botbuilder";

export class SsoOAuthHelper {

  public async shouldProcessTokenExchange(turnContext: TurnContext): Promise<boolean> {
    if (turnContext.activity.name !== tokenExchangeOperationName) {
      throw new Error(`Only '${tokenExchangeOperationName}' invoke activities can be processed by TokenExchangeHelper.`);
    }

    if (!await this.exchangeToken(turnContext)) {
      // If the TokenExchange is NOT successful, the response will have already been sent by exchangeToken
      return Promise.resolve(false);
    }

    return Promise.resolve(true);
  }

  public async exchangeToken(turnContext: TurnContext): Promise<boolean> {
    let tokenExchangeResponse: TokenResponse | null = null;
    const tokenExchangeRequest = turnContext.activity.value;

    try {
      tokenExchangeResponse = await (turnContext.adapter as BotFrameworkAdapter).exchangeToken(
        turnContext,
        tokenExchangeRequest.connectionName,
        turnContext.activity.from.id,
        tokenExchangeRequest);
    } catch (err) {
      // Ignore Exceptions: if token exchange failed for any reason, tokenExchangeResponse
      //   above stays null; send failure invoke response to the caller.
    }

    if (tokenExchangeResponse === null || !tokenExchangeResponse.token) {
      // The token could not be exchanged (which could be due to a consent requirement)
      // Notify the sender that PreconditionFailed so they can respond accordingly.
      await turnContext.sendActivity({
        type: ActivityTypes.InvokeResponse,
        value: {
          status: StatusCodes.PRECONDITION_FAILED,
          body: {
            id: tokenExchangeRequest.id,
            connectionName: tokenExchangeRequest.connectionName,
            failureDetail: "The bot is unable to exchange token. Proceed with regular login."
          }
        }
      });

      return Promise.resolve(false);
    } else {
      // Store response in TurnState, so the SsoOAuthPrompt can use it, and not have to do the exchange again.
      turnContext.turnState.set("tokenExchangeInvokeRequest", tokenExchangeRequest);
      turnContext.turnState.set("tokenExchangeResponse", tokenExchangeResponse);
    }
    return Promise.resolve(true);
  }
}
