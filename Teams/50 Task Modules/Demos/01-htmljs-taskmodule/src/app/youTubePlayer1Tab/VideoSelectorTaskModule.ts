import { PreventIframe } from "express-msteams-host";

@PreventIframe("/youTubePlayer1Tab/selector.html")

export class VideoSelectorTaskModule { }