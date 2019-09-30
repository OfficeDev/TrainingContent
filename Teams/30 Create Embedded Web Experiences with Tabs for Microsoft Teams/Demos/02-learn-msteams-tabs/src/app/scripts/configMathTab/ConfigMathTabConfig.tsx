// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

import * as React from "react";
import {
  Flex, Provider, themes, ThemePrepared,
  Header,
  Dropdown, DropdownProps, Text
} from "@stardust-ui/react";
import TeamsBaseComponent, { ITeamsBaseComponentProps, ITeamsBaseComponentState } from "msteams-react-base-component";
import * as microsoftTeams from "@microsoft/teams-js";

export interface IConfigMathTabConfigState extends ITeamsBaseComponentState {
  teamsTheme: ThemePrepared;
  mathOperator: string;
}

export interface IConfigMathTabConfigProps extends ITeamsBaseComponentProps {

}

/**
 * Implementation of ConfigMathTab configuration page
 */
export class ConfigMathTabConfig extends TeamsBaseComponent<IConfigMathTabConfigProps, IConfigMathTabConfigState> {

  public componentWillMount() {
    this.updateStardustTheme(this.getQueryVariable("theme"));

    if (this.inTeams()) {
      microsoftTeams.initialize();

      microsoftTeams.getContext((context: microsoftTeams.Context) => {
        this.setState(Object.assign({}, this.state, {
          mathOperator: context.entityId.replace("MathPage", "")
        }));
        this.setValidityState(true);
      });

      microsoftTeams.settings.registerOnSaveHandler((saveEvent: microsoftTeams.settings.SaveEvent) => {
        // Calculate host dynamically to enable local debugging
        const host = "https://" + window.location.host;
        microsoftTeams.settings.setSettings({
          contentUrl: host + "/configMathTab/?data=",
          suggestedDisplayName: "Config Math Tab",
          removeUrl: host + "/configMathTab/remove.html",
          entityId: `${this.state.mathOperator}MathPage`
        });
        saveEvent.notifySuccess();
      });
    } else {
    }
  }

  public render() {
    return (
      <Provider theme={this.state.teamsTheme}>
        <Flex gap="gap.smaller" style={{ height: "300px" }}>
          <Dropdown placeholder="Select the math operator"
            items={[
              "add",
              "subtract",
              "multiply",
              "divide"
            ]}
            onSelectedChange={this.handleOnSelectedChange}></Dropdown>
        </Flex>
      </Provider>
    );
  }

  private updateStardustTheme = (teamsTheme: string = "default"): void => {
    let stardustTheme: ThemePrepared;

    switch (teamsTheme) {
      case "default":
        stardustTheme = themes.teams;
        break;
      case "dark":
        stardustTheme = themes.teamsDark;
        break;
      case "contrast":
        stardustTheme = themes.teamsHighContrast;
        break;
      default:
        stardustTheme = themes.teams;
        break;
    }
    // update the state
    this.setState(Object.assign({}, this.state, {
      teamsTheme: stardustTheme
    }));
  }

  private handleOnSelectedChange = (event, props: DropdownProps): void => {
    this.setState(Object.assign({}, this.state, {
      mathOperator: (props.value) ? props.value.toString() : "add"
    }));
  }

}
