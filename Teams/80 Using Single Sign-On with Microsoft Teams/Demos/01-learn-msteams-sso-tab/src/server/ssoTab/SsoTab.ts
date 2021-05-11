import { PreventIframe } from "express-msteams-host";

/**
 * Used as place holder for the decorators
 */
@PreventIframe("/ssoTab/index.html")
@PreventIframe("/ssoTab/config.html")
@PreventIframe("/ssoTab/remove.html")
export class SsoTab {
}
