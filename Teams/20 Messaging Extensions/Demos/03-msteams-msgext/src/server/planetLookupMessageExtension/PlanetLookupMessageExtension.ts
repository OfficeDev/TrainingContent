import * as debug from "debug";
import { PreventIframe } from "express-msteams-host";
import { TurnContext, CardFactory, MessagingExtensionQuery, MessagingExtensionResult, Attachment } from "botbuilder";
import { IMessagingExtensionMiddlewareProcessor } from "botbuilder-teams-messagingextensions";

// Initialize debug logging module
const log = debug("msteams");

@PreventIframe("/planetLookupMessageExtension/config.html")
export default class PlanetLookupMessageExtension implements IMessagingExtensionMiddlewareProcessor {

  public async onQuery(context: TurnContext, query: MessagingExtensionQuery): Promise<MessagingExtensionResult> {
    log("onQuery:\n", query);
    
    // get the search query
    let searchQuery = "";
    if (query && query.parameters && query.parameters[0].name === "searchKeyword" && query.parameters[0].value) {
      searchQuery = query.parameters[0].value.trim().toLowerCase();
    }

    // load planets
    const planets: any = require("../planets.json");
    // search results
    let queryResults: string[] = [];

    switch (searchQuery) {
      case "inner":
        // get all planets inside asteroid belt
        queryResults = planets.filter((planet) => planet.id <= 4);
        break;
      case "outer":
        // get all planets outside asteroid belt
        queryResults = planets.filter((planet) => planet.id > 4);
        break;
      default:
        // get the specified planet
        queryResults.push(planets.filter((planet) => planet.name.toLowerCase() === searchQuery)[0]);
    }

    // get the results as cards
    const searchResultsCards: Attachment[] = [];
    queryResults.forEach((planet) => {
      searchResultsCards.push(this.getPlanetResultCard(planet));
    });

    const response: MessagingExtensionResult = {
      type: "result",
      attachmentLayout: "list",
      attachments: searchResultsCards
    } as MessagingExtensionResult;

    return Promise.resolve(response);
  }

  private getPlanetResultCard(selectedPlanet: any): Attachment {
    return CardFactory.heroCard(selectedPlanet.name, selectedPlanet.summary, [selectedPlanet.imageLink]);
  }

  public async onCardButtonClicked(context: TurnContext, value: any): Promise<void> {
    // Handle the Action.Submit action on the adaptive card
    if (value.action === "moreDetails") {
      log(`I got this ${value.id}`);
    }
    return Promise.resolve();
  }

}
