// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

import { PreventIframe } from "express-msteams-host";

@PreventIframe("/youTubePlayer1Tab/selector.html")

export class VideoSelectorTaskModule { }
