import * as React from "react";
import {
  Provider,
  Flex,
  Header,
  Input,
  ThemePrepared,
  teamsTheme,
  teamsDarkTheme,
  teamsHighContrastTheme,
  DropdownProps,
  Dropdown
} from "@fluentui/react-northstar";
import TeamsBaseComponent, { ITeamsBaseComponentState } from "msteams-react-base-component";
import * as microsoftTeams from "@microsoft/teams-js";

export interface IConfigMathTabConfigState extends ITeamsBaseComponentState {
  value: string;
  teamsTheme: ThemePrepared;
  mathOperator: string;
}

export interface IConfigMathTabConfigProps {

}

/**
 * Implementation of ConfigMathTab configuration page
 */
export class ConfigMathTabConfig extends TeamsBaseComponent<IConfigMathTabConfigProps, IConfigMathTabConfigState> {

  public async componentWillMount() {
    this.updateComponentTheme(this.getQueryVariable("theme"));

    if (await this.inTeams()) {
      microsoftTeams.initialize();

      microsoftTeams.getContext((context: microsoftTeams.Context) => {
        this.setState(Object.assign({}, this.state, {
          mathOperator: context.entityId.replace("MathPage", "")
        }));
        this.updateTheme(context.theme);
        microsoftTeams.settings.setValidityState(true);
        microsoftTeams.appInitialization.notifySuccess();
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
            onChange={this.handleOnSelectedChange}></Dropdown>
        </Flex>
      </Provider>
    );
  }

  private updateComponentTheme = (currentThemeName: string = "default"): void => {
    let componentTheme: ThemePrepared;

    switch (currentThemeName) {
      case "default":
        componentTheme = teamsTheme;
        break;
      case "dark":
        componentTheme = teamsDarkTheme;
        break;
      case "contrast":
        componentTheme = teamsHighContrastTheme;
        break;
      default:
        componentTheme = teamsTheme;
        break;
    }
    // update the state
    this.setState(Object.assign({}, this.state, {
      teamsTheme: componentTheme
    }));
  }

  private handleOnSelectedChange = (event, props: DropdownProps): void => {
    this.setState(Object.assign({}, this.state, {
      mathOperator: (props.value) ? props.value.toString() : "add"
    }));
  }
}
