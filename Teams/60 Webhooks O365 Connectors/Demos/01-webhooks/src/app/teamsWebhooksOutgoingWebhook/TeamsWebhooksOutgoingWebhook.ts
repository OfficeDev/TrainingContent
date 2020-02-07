import * as builder from "botbuilder";
import * as express from "express";
import * as crypto from "crypto";
import { OutgoingWebhookDeclaration, IOutgoingWebhook } from "express-msteams-host";

import { find, sortBy } from "lodash";

/**
 * Implementation for Teams Webhooks Outgoing Webhook
 */
@OutgoingWebhookDeclaration("/api/webhook")
export class TeamsWebhooksOutgoingWebhook implements IOutgoingWebhook {

  /**
   * The constructor
   */
  public constructor() {
  }

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
      const msgHash = "HMAC " + crypto.
        createHmac("sha256", new Buffer(securityToken as string, "base64")).
        update(msgBuf).
        digest("base64");

      if (msgHash === auth) {
        // Message was ok and verified
        const scrubbedText = TeamsWebhooksOutgoingWebhook.scrubMessage(incoming.text)
        message = TeamsWebhooksOutgoingWebhook.processAuthenticatedRequest(scrubbedText);
      } else {
        // Message could not be verified
        message.text = `Error: message sender cannot be verified`;
      }
    } else {
      // There is no configured security token
      message.text = `Error: outgoing webhook is not configured with a security token`;
    }

    // send the message
    res.send(JSON.stringify(message));
  }

  private static scrubMessage(incomingText: string): string {
    let cleanMessage = incomingText
      .slice(incomingText.lastIndexOf(">") + 1, incomingText.length)
      .replace("&nbsp;", "");
    return cleanMessage;
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

  private static getPlanetDetailCard(selectedPlanet: any): builder.Attachment {

    // load display card
    const adaptiveCardSource: any = require("./planetDisplayCard.json");

    // update planet fields in display card
    adaptiveCardSource.actions[0].url = selectedPlanet.wikiLink;
    find(adaptiveCardSource.body, { "id": "cardHeader" }).items[0].text = selectedPlanet.name;
    const cardBody: any = find(adaptiveCardSource.body, { "id": "cardBody" });
    find(cardBody.items, { "id": "planetSummary" }).text = selectedPlanet.summary;
    find(cardBody.items, { "id": "imageAttribution" }).text = "*Image attribution: " + selectedPlanet.imageAlt + "*";
    const cardDetails: any = find(cardBody.items, { "id": "planetDetails" });
    cardDetails.columns[0].items[0].url = selectedPlanet.imageLink;
    find(cardDetails.columns[1].items[0].facts, { "id": "orderFromSun" }).value = selectedPlanet.id;
    find(cardDetails.columns[1].items[0].facts, { "id": "planetNumSatellites" }).value = selectedPlanet.numSatellites;
    find(cardDetails.columns[1].items[0].facts, { "id": "solarOrbitYears" }).value = selectedPlanet.solarOrbitYears;
    find(cardDetails.columns[1].items[0].facts, { "id": "solarOrbitAvgDistanceKm" }).value = Number(selectedPlanet.solarOrbitAvgDistanceKm).toLocaleString();

    // return the adaptive card
    return builder.CardFactory.adaptiveCard(adaptiveCardSource);
  }

}
