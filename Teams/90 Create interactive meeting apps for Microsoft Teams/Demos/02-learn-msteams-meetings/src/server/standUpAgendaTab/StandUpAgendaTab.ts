import { PreventIframe } from "express-msteams-host";

/**
 * Used as place holder for the decorators
 */
@PreventIframe("/standUpAgendaTab/index.html")
@PreventIframe("/standUpAgendaTab/config.html")
@PreventIframe("/standUpAgendaTab/remove.html")
export class StandUpAgendaTab {
}
