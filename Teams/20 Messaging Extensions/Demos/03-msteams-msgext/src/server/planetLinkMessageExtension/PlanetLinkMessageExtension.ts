import * as debug from "debug";
import { PreventIframe } from "express-msteams-host";
import { TurnContext, CardFactory, MessagingExtensionQuery, MessagingExtensionResult, AppBasedLinkQuery } from "botbuilder";
import { IMessagingExtensionMiddlewareProcessor } from "botbuilder-teams-messagingextensions";

// Initialize debug logging module
const log = debug("msteams");

@PreventIframe("/planetLinkMessageExtension/config.html")
export default class PlanetLinkMessageExtension implements IMessagingExtensionMiddlewareProcessor {

  public async onQueryLink(context: TurnContext, query: AppBasedLinkQuery): Promise<MessagingExtensionResult> {
    // load planets
    const planets: any = require("../planets.json");
    // get the selected planet
    const selectedPlanet: any = planets.filter((planet) => planet.wikiLink === query.url)[0];
    const heroCard = CardFactory.heroCard(selectedPlanet.name, selectedPlanet.summary, [selectedPlanet.imageLink]);

    // generate the response
    return Promise.resolve({
      type: "result",
      attachmentLayout: "list",
      attachments: [heroCard]
    } as MessagingExtensionResult);
  }

}
