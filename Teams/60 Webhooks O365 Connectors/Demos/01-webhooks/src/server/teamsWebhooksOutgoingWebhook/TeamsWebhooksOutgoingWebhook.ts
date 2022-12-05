import * as builder from "botbuilder";
import * as express from "express";
import * as crypto from "crypto";
import { OutgoingWebhookDeclaration, IOutgoingWebhook } from "express-msteams-host";
import { CardFactory } from "botbuilder";
import { find, sortBy } from "lodash";
import * as ACData from "adaptivecards-templating";

/**
 * Implementation for Teams Webhooks Outgoing Webhook
 */
@OutgoingWebhookDeclaration("/api/webhook")
export class TeamsWebhooksOutgoingWebhook implements IOutgoingWebhook {

  /**
   * Implement your outgoing webhook logic here
   * @param req the Request
   * @param res the Response
   * @param next
   */
  public requestHandler(req: express.Request, res: express.Response, next: express.NextFunction) {
    // parse the incoming message
    const incoming = req.body as builder.Activity;

    // create the response, any Teams compatible responses can be used
    let message: Partial<builder.Activity> = {
      type: builder.ActivityTypes.Message
    };

    const securityToken = process.env.SECURITY_TOKEN;
    if (securityToken && securityToken.length > 0) {
      // There is a configured security token
      const auth = req.headers.authorization;
      const msgBuf = Buffer.from((req as any).rawBody, "utf8");
      const msgHash = "HMAC " + crypto
        .createHmac("sha256", Buffer.from(securityToken as string, "base64"))
        .update(msgBuf)
        .digest("base64");

      if (msgHash === auth) {
        // Message was ok and verified
        const scrubbedText = TeamsWebhooksOutgoingWebhook.scrubMessage(incoming.text);
        message = TeamsWebhooksOutgoingWebhook.processAuthenticatedRequest(scrubbedText);
      } else {
        // Message could not be verified
        message.text = "Error: message sender cannot be verified";
      }
    } else {
      // There is no configured security token
      message.text = "Error: outgoing webhook is not configured with a security token";
    }

    // send the message
    res.send(JSON.stringify(message));
  }

  private static getPlanetDetailCard(selectedPlanet: any): builder.Attachment {
    // load card template
    const adaptiveCardSource: any = require("./planetDisplayCard.json");
    // Create a Template instance from the template payload
    const template = new ACData.Template(adaptiveCardSource);
    // bind the data to the card template
    const boundTemplate = template.expand({ $root: selectedPlanet });
    // load the adaptive card
    const adaptiveCard = CardFactory.adaptiveCard(boundTemplate);
    // return the adaptive card
    return adaptiveCard;
  }

  private static processAuthenticatedRequest(incomingText: string): Partial<builder.Activity> {
    const message: Partial<builder.Activity> = {
      type: builder.ActivityTypes.Message
    };

    // load planets
    const planets: any = require("./planets.json");
    // get the selected planet
    const selectedPlanet: any = planets.filter((planet) => (planet.name as string).trim().toLowerCase() === incomingText.trim().toLowerCase());

    if (!selectedPlanet || !selectedPlanet.length) {
      message.text = `Echo ${incomingText}`;
    } else {
      const adaptiveCard = TeamsWebhooksOutgoingWebhook.getPlanetDetailCard(selectedPlanet[0]);
      message.type = "result";
      message.attachmentLayout = "list";
      message.attachments = [adaptiveCard];
    }

    return message;
  }

  private static scrubMessage(incomingText: string): string {
    const cleanMessage = incomingText
      .slice(incomingText.lastIndexOf(">") + 1, incomingText.length)
      .replace("&nbsp;", "");
    return cleanMessage;
  }

}
