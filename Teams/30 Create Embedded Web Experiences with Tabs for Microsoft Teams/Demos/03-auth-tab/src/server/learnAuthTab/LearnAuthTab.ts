import { PreventIframe } from "express-msteams-host";

/**
 * Used as place holder for the decorators
 */
@PreventIframe("/learnAuthTab/index.html")
@PreventIframe("/learnAuthTab/config.html")
@PreventIframe("/learnAuthTab/remove.html")
export class LearnAuthTab {
}
