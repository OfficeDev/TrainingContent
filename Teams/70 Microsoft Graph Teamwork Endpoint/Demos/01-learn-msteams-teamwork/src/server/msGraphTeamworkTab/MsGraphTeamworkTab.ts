import { PreventIframe } from "express-msteams-host";

/**
 * Used as place holder for the decorators
 */
@PreventIframe("/msGraphTeamworkTab/index.html")
@PreventIframe("/msGraphTeamworkTab/config.html")
@PreventIframe("/msGraphTeamworkTab/remove.html")
export class MsGraphTeamworkTab {
}
