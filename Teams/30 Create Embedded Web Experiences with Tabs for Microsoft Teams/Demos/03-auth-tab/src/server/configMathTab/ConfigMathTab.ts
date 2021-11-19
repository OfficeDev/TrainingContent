import { PreventIframe } from "express-msteams-host";

/**
 * Used as place holder for the decorators
 */
@PreventIframe("/configMathTab/index.html")
@PreventIframe("/configMathTab/config.html")
@PreventIframe("/configMathTab/remove.html")
export class ConfigMathTab {
}
