import * as debug from "debug";
import { PreventIframe } from "express-msteams-host";
import { TurnContext, CardFactory, MessagingExtensionQuery, MessagingExtensionResult, TaskModuleRequest, TaskModuleContinueResponse } from "botbuilder";
import { IMessagingExtensionMiddlewareProcessor } from "botbuilder-teams-messagingextensions";
import { find, sortBy } from "lodash";
import * as ACData from "adaptivecards-templating";

// Initialize debug logging module
const log = debug("msteams");

@PreventIframe("/planetMessagingMessageExtension/config.html")
@PreventIframe("/planetMessagingMessageExtension/action.html")
export default class PlanetMessagingMessageExtension implements IMessagingExtensionMiddlewareProcessor {

  public async onFetchTask(context: TurnContext, value: MessagingExtensionQuery): Promise<MessagingExtensionResult | TaskModuleContinueResponse> {
    // load planets & sort them by their order from the sun
    const planets: any = require("../planets.json");
    const sortedPlanets: any = sortBy(planets, ["id"])
      .map((planet) => {
        return { value: planet.id, title: planet.name };
      });
    log("sortedPlanets: ", sortedPlanets);

    // load card template
    const adaptiveCardSource: any = require("./planetSelectorCard.json");
    // Create a Template instance from the template payload
    const template = new ACData.Template(adaptiveCardSource);
    // bind the data to the card template
    const boundTemplate = template.expand({ $root: sortedPlanets });
    // load the adaptive card
    const adaptiveCard = CardFactory.adaptiveCard(boundTemplate);

    const response: TaskModuleContinueResponse = {
      type: "continue",
      value: {
        card: adaptiveCard,
        title: "Planet Selector",
        height: 150,
        width: 500
      }
    } as TaskModuleContinueResponse;

    return Promise.resolve(response);
  }

  // handle action response in here
  // See documentation for `MessagingExtensionResult` for details
  public async onSubmitAction(context: TurnContext, value: TaskModuleRequest): Promise<MessagingExtensionResult> {
    // load planets
    const planets: any = require("../planets.json");
    // get the selected planet
    const selectedPlanet: any = planets.filter((planet) => planet.id === value.data.planetSelector)[0];

    // load card template
    const adaptiveCardSource: any = require("./planetDisplayCard.json");
    // Create a Template instance from the template payload
    const template = new ACData.Template(adaptiveCardSource);
    // bind the data to the card template
    const boundTemplate = template.expand({ $root: selectedPlanet });
    // load the adaptive card
    const adaptiveCard = CardFactory.adaptiveCard(boundTemplate);

    return Promise.resolve({
      type: "result",
      attachmentLayout: "list",
      attachments: [adaptiveCard]
    });
  }
}
