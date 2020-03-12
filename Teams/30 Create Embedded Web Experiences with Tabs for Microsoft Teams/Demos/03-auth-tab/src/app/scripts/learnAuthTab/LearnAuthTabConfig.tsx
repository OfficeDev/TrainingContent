// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

import * as React from "react";
import { Provider, Flex, Header, Input } from "@fluentui/react";
import TeamsBaseComponent, { ITeamsBaseComponentProps, ITeamsBaseComponentState } from "msteams-react-base-component";
import * as microsoftTeams from "@microsoft/teams-js";

export interface ILearnAuthTabConfigState extends ITeamsBaseComponentState {
  value: string;
}

export interface ILearnAuthTabConfigProps extends ITeamsBaseComponentProps {

}

/**
 * Implementation of LearnAuthTab configuration page
 */
export class LearnAuthTabConfig extends TeamsBaseComponent<ILearnAuthTabConfigProps, ILearnAuthTabConfigState> {

  public componentWillMount() {
    this.updateTheme(this.getQueryVariable("theme"));
    this.setState({
      fontSize: this.pageFontSize()
    });

    if (this.inTeams()) {
      microsoftTeams.initialize();

      microsoftTeams.getContext((context: microsoftTeams.Context) => {
        this.setState({
          value: context.entityId
        });
        this.updateTheme(context.theme);
        this.setValidityState(true);
      });

      microsoftTeams.settings.registerOnSaveHandler((saveEvent: microsoftTeams.settings.SaveEvent) => {
        // Calculate host dynamically to enable local debugging
        const host = "https://" + window.location.host;
        microsoftTeams.settings.setSettings({
          contentUrl: host + "/learnAuthTab/?data=",
          suggestedDisplayName: "LearnAuthTab",
          removeUrl: host + "/learnAuthTab/remove.html",
          entityId: this.state.value
        });
        saveEvent.notifySuccess();
      });
    } else {
    }
  }

  public render() {
    return (
      <Provider theme={this.state.theme}>
        <Flex fill={true}>
          <Flex.Item>
            <div>
              <Header content="Configure your tab" />
              <Input
                placeholder="Enter a value here"
                fluid
                clearable
                value={this.state.value}
                onChange={(e, data) => {
                  if (data) {
                    this.setState({
                      value: data.value
                    });
                  }
                }}
                required />
            </div>
          </Flex.Item>
        </Flex>
      </Provider>
    );
  }
}
