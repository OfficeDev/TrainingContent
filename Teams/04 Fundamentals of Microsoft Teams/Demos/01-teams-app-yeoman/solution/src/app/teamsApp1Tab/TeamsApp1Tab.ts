import { PreventIframe } from "express-msteams-host";

/**
 * Used as place holder for the decorators
 */
@PreventIframe("/teamsApp1Tab/index.html")
@PreventIframe("/teamsApp1Tab/config.html")
@PreventIframe("/teamsApp1Tab/remove.html")
export class TeamsApp1Tab {
}
